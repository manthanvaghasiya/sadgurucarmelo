import { GoogleGenerativeAI } from '@google/generative-ai';
import Settings from '../models/Settings.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getGeminiKeysWithStates() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings({ geminiApiKeys: [], geminiKeyStates: [] });
    await settings.save();
  }

  let rawKeys = [];
  if (settings.geminiApiKeys && settings.geminiApiKeys.length > 0) {
    rawKeys = settings.geminiApiKeys.filter((k) => k && k.trim().length > 0);
  } else if (process.env.GEMINI_API_KEY) {
    rawKeys = process.env.GEMINI_API_KEY.split(',').map((k) => k.trim()).filter(Boolean);
  }

  if (rawKeys.length === 0) return { settings, validKeys: [] };

  // Sync state array with rawKeys (in case new keys were added via UI or env)
  let stateChanged = false;
  const statesByKey = new Map();
  if (settings.geminiKeyStates) {
    settings.geminiKeyStates.forEach((st) => statesByKey.set(st.key, st));
  }

  const validKeys = [];
  const now = new Date();

  for (const key of rawKeys) {
    let state = statesByKey.get(key);
    if (!state) {
      state = { key, isInvalid: false, exhaustedUntil: null, lastUsed: null };
      settings.geminiKeyStates.push(state);
      statesByKey.set(key, state);
      stateChanged = true;
    }

    if (state.isInvalid) continue;
    if (state.exhaustedUntil && state.exhaustedUntil > now) continue;

    validKeys.push({ key, state });
  }

  if (stateChanged) {
    await settings.save();
  }

  // Sort by lastUsed (ascending) to implement LRU rotation across calls
  validKeys.sort((a, b) => {
    const timeA = a.state.lastUsed ? a.state.lastUsed.getTime() : 0;
    const timeB = b.state.lastUsed ? b.state.lastUsed.getTime() : 0;
    return timeA - timeB;
  });

  return { settings, validKeys };
}

export async function markKeyState(settings, key, updates) {
  try {
    const state = settings.geminiKeyStates.find((s) => s.key === key);
    if (state) {
      if (updates.isInvalid !== undefined) state.isInvalid = updates.isInvalid;
      if (updates.exhaustedUntil !== undefined) state.exhaustedUntil = updates.exhaustedUntil;
      if (updates.lastUsed !== undefined) state.lastUsed = updates.lastUsed;
      await settings.save();
    }
  } catch (err) {
    console.error('Error updating Gemini key state:', err);
  }
}

export async function executeWithRotation(actionFn) {
  const { settings, validKeys } = await getGeminiKeysWithStates();

  if (validKeys.length === 0) {
    const error = new Error('No valid Gemini API keys available. Please add a key in Admin Settings or check quota.');
    error.status = 429;
    throw error;
  }

  let lastError;
  const now = Date.now();

  for (const keyObj of validKeys) {
    const { key, state } = keyObj;

    // Enforce minimum 4s delay per key to respect free tier (15 RPM)
    const lastUsedTime = state.lastUsed ? state.lastUsed.getTime() : 0;
    const timeSinceLastUse = now - lastUsedTime;
    if (timeSinceLastUse < 4000) {
      await delay(4000 - timeSinceLastUse);
    }

    try {
      await markKeyState(settings, key, { lastUsed: new Date() });
      const genAI = new GoogleGenerativeAI(key);
      const result = await actionFn(genAI);
      return result;
    } catch (error) {
      console.warn(`Gemini API key ending in ${key.slice(-4)} failed:`, error.message);
      lastError = error;

      const errMessage = error.message.toLowerCase();

      if (errMessage.includes('api key not valid') || errMessage.includes('invalid api key')) {
        await markKeyState(settings, key, { isInvalid: true });
      } else if (errMessage.includes('429') || errMessage.includes('quota') || errMessage.includes('exhausted')) {
        // Penalty for 60 seconds
        await markKeyState(settings, key, { exhaustedUntil: new Date(Date.now() + 60000) });
      }
    }
  }

  const finalError = new Error(`All available keys failed. Last error: ${lastError ? lastError.message : 'Unknown'}`);
  finalError.status = lastError ? (lastError.status || 500) : 500;
  throw finalError;
}

export function callGeminiWithRetry(actionFn) {
  return executeWithRotation(actionFn);
}

// ── Smart Regex / Heuristic Fallback Parser ──
// Extracts dealer WhatsApp message patterns instantly if no Gemini key or offline
export function heuristicParseCar(rawText) {
  if (!rawText || typeof rawText !== 'string') return {};

  const clean = rawText.replace(/\*/g, ''); // strip markdown bold asterisks
  const lines = clean.split('\n').map((l) => l.trim()).filter(Boolean);

  const data = {
    make: '',
    model: '',
    variant: '',
    manufacturingYear: '',
    registerYear: '',
    price: '',
    kmDriven: '',
    fuelType: '',
    transmission: '',
    ownership: '',
    color: '',
    registration: '',
    insurance: '',
    bodyType: 'SUV',
    description: '',
    features: [],
    displacement: '',
    maxPower: '',
    driveType: 'FWD',
    cylinders: '4',
    airConditioner: 'Automatic Climate Control',
    powerWindows: 'All 4 Windows',
    sunroof: 'No',
    parkingSensors: 'Rear Parking Sensors',
    isCertified: true,
    isPetipack: false,
    validVimo: false,
    loanAvailable: true,
    isKmGenuine: true,
  };

  for (const line of lines) {
    const colonIdx = line.indexOf(':-') !== -1 ? line.indexOf(':-') : line.indexOf(':');
    if (colonIdx === -1) continue;

    const label = line.substring(0, colonIdx).toLowerCase().replace(/[^a-z0-9/]/g, '');
    const value = line.substring(colonIdx + (line[colonIdx + 1] === '-' ? 2 : 1)).trim();

    if (!value) continue;

    if (label.includes('make') || label.includes('brand')) {
      data.make = value.toUpperCase();
    } else if (label.includes('model')) {
      data.model = value.toUpperCase();
    } else if (label.includes('version') || label.includes('variant') || label.includes('ver')) {
      data.variant = value.toUpperCase();
    } else if (label.includes('reg') && !label.includes('year')) {
      data.registration = value.toUpperCase();
    } else if (label.includes('year') || label.includes('mfg')) {
      if (value.includes('-') || value.includes('/')) {
        const parts = value.split(/[-/]/);
        data.manufacturingYear = parts[0];
        data.registerYear = value;
      } else {
        data.manufacturingYear = value;
        data.registerYear = value;
      }
    } else if (label.includes('trans') || label.includes('gear')) {
      data.transmission = value.toLowerCase().includes('auto') ? 'Automatic' : 'Manual';
    } else if (label.includes('owner')) {
      data.ownership = value.includes('1') ? '1st' : (value.includes('2') ? '2nd' : value);
    } else if (label.includes('colour') || label.includes('color')) {
      data.color = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    } else if (label.includes('fuel')) {
      const f = value.toLowerCase();
      if (f.includes('diesel')) data.fuelType = 'Diesel';
      else if (f.includes('petrol')) data.fuelType = 'Petrol';
      else if (f.includes('cng')) data.fuelType = 'CNG';
      else if (f.includes('electric') || f.includes('ev')) data.fuelType = 'Electric';
      else data.fuelType = value;
    } else if (label.includes('ins')) {
      data.insurance = value;
      if (value.toLowerCase().includes('full') || value.toLowerCase().includes('comprehensive') || value.includes('202')) {
        data.validVimo = true;
      }
    } else if (label.includes('km') || label.includes('k/m')) {
      data.kmDriven = value.replace(/[^0-9]/g, '');
    } else if (label.includes('price')) {
      data.price = value.replace(/[^0-9]/g, '');
    }
  }

  // Prepopulate standard features based on common model types
  if (data.model.includes('SELTOS') || data.model.includes('CRETA') || data.model.includes('HARRIER')) {
    data.bodyType = 'SUV';
    data.sunroof = 'Electric Sunroof';
    data.displacement = '1493 cc';
    data.maxPower = '113 bhp';
    data.features = [
      { key: 'Touchscreen', value: '10.25-inch HD Display' },
      { key: 'Alloy Wheels', value: '17-inch Diamond Cut' },
      { key: 'Sunroof', value: 'Electric Sunroof' },
      { key: 'Cruise Control', value: 'Yes' },
      { key: 'Rear AC Vents', value: 'Yes' },
      { key: 'Airbags', value: '6 Airbags' },
      { key: 'LED Headlamps', value: 'LED DRLs & Projectors' },
      { key: 'Reverse Camera', value: 'With Dynamic Guidelines' },
      { key: 'Push Button Start', value: 'Smart Keyless Entry' }
    ];
  } else {
    data.features = [
      { key: 'Power Steering', value: 'Yes' },
      { key: 'Power Windows', value: 'All 4 Windows' },
      { key: 'Air Conditioning', value: 'Yes' },
      { key: 'Music System', value: 'Bluetooth & USB' },
      { key: 'Central Locking', value: 'Remote Keyless' }
    ];
  }

  return data;
}
