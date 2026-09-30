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

export function normalizeOwnership(val) {
  if (!val) return '1st Owner';
  const s = String(val).toLowerCase().trim();
  if (s.includes('1') || s.includes('first') || s.includes('single') || s.includes('1st')) return '1st Owner';
  if (s.includes('2') || s.includes('second') || s.includes('2nd')) return '2nd Owner';
  if (s.includes('3') || s.includes('third') || s.includes('3rd')) return '3rd Owner';
  if (s.includes('4') || s.includes('four') || s.includes('4th')) return '4th Owner+';
  if (s.includes('unreg')) return 'Unregistered';
  return '1st Owner';
}

// ── Indian Automotive Knowledge Base for Quick-Fill & Fallback ──
export function getAutomotiveSpecs(make, model, variant, fuelType) {
  const makeUpper = (make || '').toUpperCase();
  const modelUpper = (model || '').toUpperCase();
  const variantUpper = (variant || '').toUpperCase();
  const fuelTypeUpper = (fuelType || '').toUpperCase();

  const isDiesel = fuelTypeUpper.includes('DIESEL');
  const isCng = fuelTypeUpper.includes('CNG');
  const isEv = fuelTypeUpper.includes('ELECTRIC') || fuelTypeUpper.includes('EV');

  // 1. KIA SELTOS
  if (modelUpper.includes('SELTOS')) {
    return {
      bodyType: 'SUV',
      airConditioner: 'Automatic Climate Control',
      powerWindows: 'All 4 Windows',
      sunroof: 'Electric Sunroof',
      parkingSensors: 'Rear Parking Sensors',
      displacement: isDiesel ? '1493 cc' : (variantUpper.includes('TURBO') ? '1353 cc' : '1497 cc'),
      maxPower: isDiesel ? '113 bhp' : (variantUpper.includes('TURBO') ? '138 bhp' : '113 bhp'),
      driveType: 'FWD',
      cylinders: '4',
      features: [
        { key: 'Touchscreen', value: '10.25-inch HD Display' },
        { key: 'Alloy Wheels', value: '17-inch Diamond Cut' },
        { key: 'Sunroof', value: 'Electric Sunroof' },
        { key: 'Cruise Control', value: 'Yes' },
        { key: 'Rear AC Vents', value: 'Yes' },
        { key: 'Airbags', value: '6 Airbags' },
        { key: 'LED Headlamps', value: 'LED DRLs & Projectors' },
        { key: 'Reverse Camera', value: 'With Dynamic Guidelines' },
        { key: 'Push Button Start', value: 'Smart Keyless Entry' }
      ]
    };
  }

  // 2. HYUNDAI CRETA
  if (modelUpper.includes('CRETA')) {
    return {
      bodyType: 'SUV',
      airConditioner: 'Automatic Climate Control',
      powerWindows: 'All 4 Windows',
      sunroof: 'Panoramic Sunroof',
      parkingSensors: 'Rear Parking Sensors',
      displacement: isDiesel ? '1493 cc' : '1497 cc',
      maxPower: '113 bhp',
      driveType: 'FWD',
      cylinders: '4',
      features: [
        { key: 'Touchscreen', value: '10.25-inch HD Touchscreen' },
        { key: 'Sunroof', value: 'Voice Enabled Panoramic Sunroof' },
        { key: 'Alloy Wheels', value: '17-inch Diamond Cut Alloys' },
        { key: 'Airbags', value: '6 Airbags' },
        { key: 'Cruise Control', value: 'Yes' },
        { key: 'Rear AC Vents', value: 'Yes with USB Charger' },
        { key: 'LED Headlamps', value: 'Trio Beam LED Headlamps & DRLs' },
        { key: 'Reverse Camera', value: 'With Dynamic Guidelines' },
        { key: 'Push Button Start', value: 'Smart Keyless Entry' }
      ]
    };
  }

  // 3. MARUTI SUZUKI SWIFT / DZIRE
  if (modelUpper.includes('SWIFT') || modelUpper.includes('DZIRE')) {
    const isSedan = modelUpper.includes('DZIRE');
    return {
      bodyType: isSedan ? 'Sedan' : 'Hatchback',
      airConditioner: 'Automatic Climate Control',
      powerWindows: 'All 4 Windows',
      sunroof: 'No',
      parkingSensors: 'Rear Parking Sensors',
      displacement: '1197 cc',
      maxPower: isCng ? '76.4 bhp' : '88.5 bhp',
      driveType: 'FWD',
      cylinders: '4',
      features: [
        { key: 'Touchscreen', value: '7-inch SmartPlay Studio with Apple CarPlay' },
        { key: 'Alloy Wheels', value: '15-inch Precision Cut Alloys' },
        { key: 'Cruise Control', value: 'Yes' },
        { key: 'LED Headlamps', value: 'LED Projector Headlamps with DRLs' },
        { key: 'Airbags', value: 'Dual Front Airbags & ABS with EBD' },
        { key: 'Reverse Camera', value: 'With Guidelines' },
        { key: 'Push Button Start', value: 'Smart Keyless Entry' },
        { key: 'Steering Controls', value: 'Mounted Audio & Bluetooth' }
      ]
    };
  }

  // 4. MARUTI SUZUKI BREZZA / VITARA BREZZA
  if (modelUpper.includes('BREZZA')) {
    return {
      bodyType: 'SUV',
      airConditioner: 'Automatic Climate Control',
      powerWindows: 'All 4 Windows',
      sunroof: 'Electric Sunroof',
      parkingSensors: 'Rear Parking Sensors',
      displacement: '1462 cc',
      maxPower: isCng ? '86.6 bhp' : '101.6 bhp',
      driveType: 'FWD',
      cylinders: '4',
      features: [
        { key: 'Touchscreen', value: '9-inch SmartPlay Pro+ Display' },
        { key: 'Sunroof', value: 'Electric Sunroof' },
        { key: 'Alloy Wheels', value: '16-inch Dual Tone Alloys' },
        { key: 'Cruise Control', value: 'Yes' },
        { key: '360 Camera', value: '360-Degree Surround View' },
        { key: 'Airbags', value: '6 Airbags' },
        { key: 'Rear AC Vents', value: 'Yes' },
        { key: 'Push Button Start', value: 'Engine Start/Stop with Smart Key' }
      ]
    };
  }

  // 5. MARUTI BALENO / FRONX / TOYOTA GLANZA
  if (modelUpper.includes('BALENO') || modelUpper.includes('FRONX') || modelUpper.includes('GLANZA')) {
    return {
      bodyType: modelUpper.includes('FRONX') ? 'SUV' : 'Hatchback',
      airConditioner: 'Automatic Climate Control',
      powerWindows: 'All 4 Windows',
      sunroof: 'No',
      parkingSensors: 'Rear Parking Sensors',
      displacement: '1197 cc',
      maxPower: '88.5 bhp',
      driveType: 'FWD',
      cylinders: '4',
      features: [
        { key: 'Touchscreen', value: '9-inch SmartPlay Pro+ HD' },
        { key: 'Alloy Wheels', value: '16-inch Precision Cut Alloys' },
        { key: 'Head-Up Display', value: 'Retractable Color HUD' },
        { key: '360 Camera', value: '360-Degree View HD Camera' },
        { key: 'Airbags', value: '6 Airbags' },
        { key: 'Cruise Control', value: 'Yes' },
        { key: 'Rear AC Vents', value: 'Yes with USB Fast Charger' },
        { key: 'Push Button Start', value: 'Smart Key with Push Button' }
      ]
    };
  }

  // 6. TOYOTA INNOVA / INNOVA CRYSTA / HYCROSS
  if (modelUpper.includes('INNOVA')) {
    return {
      bodyType: 'MUV',
      airConditioner: 'Automatic Climate Control (Dual AC)',
      powerWindows: 'All 4 Windows',
      sunroof: modelUpper.includes('HYCROSS') ? 'Panoramic Sunroof' : 'No',
      parkingSensors: 'Front & Rear Parking Sensors',
      displacement: modelUpper.includes('HYCROSS') ? '1987 cc' : '2393 cc',
      maxPower: modelUpper.includes('HYCROSS') ? '183 bhp' : '148 bhp',
      driveType: modelUpper.includes('HYCROSS') ? 'FWD' : 'RWD',
      cylinders: '4',
      features: [
        { key: 'Touchscreen', value: '8-inch Display with Apple CarPlay & Android Auto' },
        { key: 'Alloy Wheels', value: '17-inch Diamond Cut Alloys' },
        { key: 'Seating', value: 'Captain Seats (7 Seater) with Armrests' },
        { key: 'Airbags', value: '7 Airbags with Driver Knee Airbag' },
        { key: 'Cruise Control', value: 'Yes' },
        { key: 'Reverse Camera', value: 'With Dynamic Guidelines' },
        { key: 'Push Button Start', value: 'Smart Entry & Push Start' },
        { key: 'Drive Modes', value: 'Eco & Power Drive Modes' }
      ]
    };
  }

  // 7. TOYOTA FORTUNER / LEGENDR
  if (modelUpper.includes('FORTUNER') || modelUpper.includes('LEGENDER')) {
    return {
      bodyType: 'SUV',
      airConditioner: 'Dual-Zone Automatic Climate Control',
      powerWindows: 'All 4 Windows',
      sunroof: 'No',
      parkingSensors: 'Front & Rear Parking Sensors',
      displacement: isDiesel ? '2755 cc' : '2694 cc',
      maxPower: isDiesel ? '201 bhp' : '163 bhp',
      driveType: variantUpper.includes('4X4') || variantUpper.includes('4WD') ? '4WD' : 'RWD',
      cylinders: '4',
      features: [
        { key: 'Touchscreen', value: '8-inch Touchscreen with Connected Tech' },
        { key: 'Alloy Wheels', value: '18-inch Super Chrome Alloys' },
        { key: 'Ventilated Seats', value: 'Front Ventilated Seats' },
        { key: 'Airbags', value: '7 SRS Airbags' },
        { key: 'Audio', value: 'JBL 11-Speaker Premium Audio' },
        { key: 'Cruise Control', value: 'Yes' },
        { key: 'Power Tailgate', value: 'Kick-Sensor Back Door' },
        { key: 'Reverse Camera', value: '360 Panoramic View Monitor' }
      ]
    };
  }

  // 8. MAHINDRA XUV700
  if (modelUpper.includes('XUV700') || modelUpper.includes('XUV 700')) {
    return {
      bodyType: 'SUV',
      airConditioner: 'Dual-Zone Automatic Climate Control',
      powerWindows: 'All 4 Windows',
      sunroof: 'Panoramic Skyroof',
      parkingSensors: 'Front & Rear Sensors',
      displacement: isDiesel ? '2198 cc' : '1997 cc',
      maxPower: isDiesel ? '182 bhp' : '197 bhp',
      driveType: variantUpper.includes('AWD') ? 'AWD' : 'FWD',
      cylinders: '4',
      features: [
        { key: 'Touchscreen', value: 'Dual 10.25-inch Superscreen Displays' },
        { key: 'Sunroof', value: 'Panoramic Skyroof' },
        { key: 'ADAS', value: 'Level 2 ADAS Safety Suite' },
        { key: 'Alloy Wheels', value: '18-inch Diamond Cut Alloys' },
        { key: 'Audio', value: 'Sony 12-Speaker 3D Audio' },
        { key: 'Airbags', value: '7 Airbags' },
        { key: 'Cruise Control', value: 'Adaptive Cruise Control' },
        { key: 'Reverse Camera', value: '360-Degree Surround View' },
        { key: 'Smart Handles', value: 'Flush Smart Door Handles' }
      ]
    };
  }

  // 9. MAHINDRA SCORPIO / SCORPIO-N / CLASSIC
  if (modelUpper.includes('SCORPIO')) {
    return {
      bodyType: 'SUV',
      airConditioner: 'Dual-Zone Automatic Climate Control',
      powerWindows: 'All 4 Windows',
      sunroof: modelUpper.includes('N') ? 'Electric Sunroof' : 'No',
      parkingSensors: 'Front & Rear Sensors',
      displacement: '2198 cc',
      maxPower: modelUpper.includes('N') ? '172 bhp' : '130 bhp',
      driveType: variantUpper.includes('4X4') || variantUpper.includes('4WD') ? '4WD' : 'RWD',
      cylinders: '4',
      features: [
        { key: 'Touchscreen', value: '8-inch Touchscreen Infotainment' },
        { key: 'Sunroof', value: modelUpper.includes('N') ? 'Electric Sunroof' : 'No' },
        { key: 'Alloy Wheels', value: '17-inch Diamond Cut Alloys' },
        { key: 'Audio', value: 'Sony 12-Speaker Audio' },
        { key: 'Airbags', value: '6 Airbags' },
        { key: 'Cruise Control', value: 'Yes' },
        { key: 'Reverse Camera', value: 'With Dynamic Guidelines' },
        { key: 'Push Button Start', value: 'Push Button Start/Stop' }
      ]
    };
  }

  // 10. MAHINDRA THAR / ROXX
  if (modelUpper.includes('THAR')) {
    return {
      bodyType: 'SUV',
      airConditioner: 'Manual AC with Heater',
      powerWindows: 'Front Power Windows',
      sunroof: modelUpper.includes('ROXX') ? 'Panoramic Sunroof' : 'No',
      parkingSensors: 'Rear Parking Sensors',
      displacement: isDiesel ? '2184 cc' : '1997 cc',
      maxPower: isDiesel ? '130 bhp' : '150 bhp',
      driveType: '4WD',
      cylinders: '4',
      features: [
        { key: '4x4 System', value: 'Shift-on-the-Fly 4WD with Low Range' },
        { key: 'Touchscreen', value: '7-inch Drizzle Resistant Infotainment' },
        { key: 'Alloy Wheels', value: '18-inch Deep Silver Alloys' },
        { key: 'Roof', value: 'Moulded Hard Top' },
        { key: 'Roll Cage', value: 'Built-in Roll Cage (4-Star NCAP)' },
        { key: 'Airbags', value: 'Dual Front Airbags with ESP' },
        { key: 'Cruise Control', value: 'Yes' },
        { key: 'Adventure Stats', value: 'Roll Pitch Angle & Compass Display' }
      ]
    };
  }

  // 11. TATA NEXON
  if (modelUpper.includes('NEXON')) {
    return {
      bodyType: 'SUV',
      airConditioner: 'Automatic Climate Control',
      powerWindows: 'All 4 Windows',
      sunroof: 'Voice-Assisted Electric Sunroof',
      parkingSensors: 'Front & Rear Parking Sensors',
      displacement: isDiesel ? '1497 cc' : '1199 cc',
      maxPower: isDiesel ? '113 bhp' : '118 bhp',
      driveType: 'FWD',
      cylinders: isDiesel ? '4' : '3',
      features: [
        { key: 'Touchscreen', value: '10.25-inch Floating Touchscreen' },
        { key: 'Sunroof', value: 'Voice-Assisted Electric Sunroof' },
        { key: 'Digital Cluster', value: '10.25-inch Full Digital Cockpit' },
        { key: 'Airbags', value: '6 Airbags Standard' },
        { key: '360 Camera', value: '360-Degree Surround Camera' },
        { key: 'Ventilated Seats', value: 'Front Ventilated Seats' },
        { key: 'Audio', value: 'JBL 9-Speaker Audio with Subwoofer' },
        { key: 'Cruise Control', value: 'Yes' }
      ]
    };
  }

  // 12. TATA HARRIER / SAFARI
  if (modelUpper.includes('HARRIER') || modelUpper.includes('SAFARI')) {
    return {
      bodyType: 'SUV',
      airConditioner: 'Dual-Zone Automatic Climate Control',
      powerWindows: 'All 4 Windows',
      sunroof: 'Voice-Activated Panoramic Sunroof',
      parkingSensors: 'Front & Rear Parking Sensors',
      displacement: '1956 cc',
      maxPower: '168 bhp',
      driveType: 'FWD',
      cylinders: '4',
      features: [
        { key: 'Touchscreen', value: '12.3-inch Cinematic HD Touchscreen' },
        { key: 'Sunroof', value: 'Voice-Activated Panoramic Sunroof' },
        { key: 'ADAS', value: 'Advanced ADAS Suite (11 Safety Features)' },
        { key: 'Audio', value: 'JBL 10-Speaker Audio with Subwoofer' },
        { key: 'Airbags', value: '7 Airbags' },
        { key: 'Ventilated Seats', value: 'Front Ventilated Leather Seats' },
        { key: '360 Camera', value: '360-Degree 3D Surround View' },
        { key: 'Cruise Control', value: 'Adaptive Cruise Control' },
        { key: 'Powered Tailgate', value: 'Gesture-Controlled Power Tailgate' }
      ]
    };
  }

  // 13. HONDA CITY
  if (modelUpper.includes('CITY')) {
    return {
      bodyType: 'Sedan',
      airConditioner: 'Automatic Climate Control with Max Cool',
      powerWindows: 'All 4 Windows',
      sunroof: 'One-Touch Electric Sunroof',
      parkingSensors: 'Rear Parking Sensors',
      displacement: '1498 cc',
      maxPower: '119.3 bhp',
      driveType: 'FWD',
      cylinders: '4',
      features: [
        { key: 'Touchscreen', value: '8-inch Touchscreen with Wireless Apple CarPlay' },
        { key: 'Sunroof', value: 'One-Touch Electric Sunroof' },
        { key: 'ADAS', value: 'Honda SENSING ADAS Suite' },
        { key: 'Alloy Wheels', value: '16-inch Diamond Cut Alloys' },
        { key: 'LaneWatch Camera', value: 'Blind Spot Camera with Guidelines' },
        { key: 'Airbags', value: '6 Airbags' },
        { key: 'Cruise Control', value: 'Adaptive Cruise Control' },
        { key: 'Push Button Start', value: 'Smart Key with Remote Engine Start' },
        { key: 'Rear AC Vents', value: 'Yes with 12V Power Outlets' }
      ]
    };
  }

  // 14. HYUNDAI VENUE / KIA SONET
  if (modelUpper.includes('VENUE') || modelUpper.includes('SONET')) {
    return {
      bodyType: 'SUV',
      airConditioner: 'Automatic Climate Control',
      powerWindows: 'All 4 Windows',
      sunroof: 'Electric Sunroof',
      parkingSensors: 'Rear Parking Sensors',
      displacement: isDiesel ? '1493 cc' : (variantUpper.includes('TURBO') ? '998 cc' : '1197 cc'),
      maxPower: isDiesel ? '114 bhp' : (variantUpper.includes('TURBO') ? '118 bhp' : '82 bhp'),
      driveType: 'FWD',
      cylinders: variantUpper.includes('TURBO') ? '3' : '4',
      features: [
        { key: 'Touchscreen', value: '10.25-inch HD Touchscreen with Navigation' },
        { key: 'Sunroof', value: 'Electric Sunroof' },
        { key: 'Airbags', value: '6 Airbags' },
        { key: 'Alloy Wheels', value: '16-inch Diamond Cut Alloys' },
        { key: 'Audio', value: 'Bose 7-Speaker Premium Sound' },
        { key: 'Ventilated Seats', value: 'Front Ventilated Seats' },
        { key: 'Cruise Control', value: 'Yes' },
        { key: 'Reverse Camera', value: 'With Dynamic Guidelines' },
        { key: 'Push Button Start', value: 'Push Button Start with Smart Key' }
      ]
    };
  }

  // 15. VOLKSWAGEN TAIGUN / VIRTUS / SKODA KUSHAQ / SLAVIA
  if (modelUpper.includes('TAIGUN') || modelUpper.includes('VIRTUS') || modelUpper.includes('KUSHAQ') || modelUpper.includes('SLAVIA')) {
    const isSedan = modelUpper.includes('VIRTUS') || modelUpper.includes('SLAVIA');
    const is15 = variantUpper.includes('1.5') || variantUpper.includes('GT');
    return {
      bodyType: isSedan ? 'Sedan' : 'SUV',
      airConditioner: 'Climatronic Automatic Climate Control',
      powerWindows: 'All 4 Windows (One-Touch)',
      sunroof: 'Electric Sunroof',
      parkingSensors: 'Rear Parking Sensors',
      displacement: is15 ? '1498 cc' : '999 cc',
      maxPower: is15 ? '148 bhp' : '113.9 bhp',
      driveType: 'FWD',
      cylinders: is15 ? '4' : '3',
      features: [
        { key: 'Touchscreen', value: '10-inch VW Play Touchscreen Infotainment' },
        { key: 'Sunroof', value: 'Electric Sunroof' },
        { key: 'Digital Cockpit', value: '8-inch Digital Cockpit Instrument Cluster' },
        { key: 'Ventilated Seats', value: 'Front Ventilated Leather Seats' },
        { key: 'Airbags', value: '6 Airbags' },
        { key: 'Cruise Control', value: 'Electronic Cruise Control' },
        { key: 'Alloy Wheels', value: '16-inch / 17-inch Razor Alloys' },
        { key: 'Reverse Camera', value: 'Rear View Camera with Guidelines' }
      ]
    };
  }

  // Generic / Default Automotive Specs
  return {
    bodyType: 'SUV',
    airConditioner: 'Automatic Climate Control',
    powerWindows: 'All 4 Windows',
    sunroof: 'No',
    parkingSensors: 'Rear Parking Sensors',
    displacement: '1493 cc',
    maxPower: '113 bhp',
    driveType: 'FWD',
    cylinders: '4',
    features: [
      { key: 'Touchscreen', value: 'Smart HD Touchscreen Infotainment' },
      { key: 'Power Steering', value: 'Electric Power Steering with Tilt' },
      { key: 'Power Windows', value: 'All 4 Power Windows' },
      { key: 'Airbags', value: 'Dual Front Airbags & ABS with EBD' },
      { key: 'Central Locking', value: 'Remote Keyless Central Locking' },
      { key: 'Air Conditioning', value: 'High Efficiency Air Conditioning' },
      { key: 'Reverse Camera', value: 'Rear Parking Camera with Guidelines' },
      { key: 'Music System', value: 'Bluetooth, FM & USB Audio Support' }
    ]
  };
}

// ── Smart Ownership Normalizer ──
export function normalizeOwnership(val) {
  if (!val) return '1st Owner';
  const s = String(val).toLowerCase();
  if (s.includes('1') || s.includes('first')) return '1st Owner';
  if (s.includes('2') || s.includes('second')) return '2nd Owner';
  if (s.includes('3') || s.includes('third')) return '3rd Owner';
  if (s.includes('4') || s.includes('fourth')) return '4th Owner+';
  if (s.includes('unreg')) return 'Unregistered';
  return '1st Owner';
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
    ownership: '1st Owner',
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
      const match = value.match(/\b(19\d\d|20\d\d)\b/);
      const cleanYear = match ? match[1] : value;
      data.manufacturingYear = cleanYear;
      data.registerYear = cleanYear;
    } else if (label.includes('trans') || label.includes('gear')) {
      data.transmission = value.toLowerCase().includes('auto') ? 'Automatic' : 'Manual';
    } else if (label.includes('owner')) {
      data.ownership = normalizeOwnership(value);
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

  // Prepopulate specs & features based on accurate Indian automotive database
  const specs = getAutomotiveSpecs(
    data.make || '',
    data.model || '',
    data.variant || '',
    data.fuelType || ''
  );

  data.bodyType = specs.bodyType;
  data.airConditioner = specs.airConditioner;
  data.powerWindows = specs.powerWindows;
  data.sunroof = specs.sunroof;
  data.parkingSensors = specs.parkingSensors;
  data.displacement = specs.displacement;
  data.maxPower = specs.maxPower;
  data.driveType = specs.driveType;
  data.cylinders = specs.cylinders;
  data.features = specs.features;

  // Auto-generate certified description
  const carName = [data.make, data.model, data.variant].filter(Boolean).join(' ');
  data.description = carName
    ? `${carName} in excellent condition. Certified by Sadguru Car Melo.`
    : 'Certified pre-owned vehicle in excellent condition by Sadguru Car Melo.';

  return data;
}

