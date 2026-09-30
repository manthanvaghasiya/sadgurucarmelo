import express from 'express';
import { callGeminiWithRetry, heuristicParseCar, normalizeOwnership } from '../utils/geminiHelper.js';
import Settings from '../models/Settings.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/ai/parse-car
// @desc    Parse raw car text (e.g. WhatsApp dealer message) and auto-generate specs & features using Gemini AI
// @access  Protected (Admin / Manager)
router.post('/parse-car', protect, async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Please provide car details or WhatsApp text to parse.' });
  }

  // 1. Calculate heuristic baseline immediately
  const fallback = heuristicParseCar(text);

  // 2. Attempt Gemini AI extraction with structured JSON and Indian automotive specs lookup
  try {
    const geminiResult = await callGeminiWithRetry(async (genAI) => {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });

      const prompt = `
        You are an expert Indian automotive data analyst and pre-owned car dealership assistant for "Sadguru Car Melo", Surat, Gujarat, India.
        
        TASK:
        1. Parse the following raw text / dealer WhatsApp message into clean, structured car listing fields.
        2. Based on the identified Make, Model, and Variant (e.g., KIA Seltos HTX Diesel 2019), LOOK UP and auto-generate the exact Indian automotive technical specifications and comprehensive equipment/features list for this vehicle.
        
        Raw Text from Dealer / Seller:
        """
        ${text.slice(0, 10000)}
        """

        Return ONLY a valid JSON object matching this schema:
        {
          "make": "Manufacturer name in Title Case, e.g. 'Kia', 'Hyundai', 'Maruti Suzuki', 'Tata', 'Toyota', 'Honda', 'Mahindra'",
          "model": "Car model in Title Case, e.g. 'Seltos', 'Creta', 'Brezza', 'Harrier', 'City', 'Innova Crysta', 'Swift'",
          "variant": "Variant / trim level, e.g. 'HTX', 'SX (O)', 'ZXi+', 'XZ+', 'ZX'",
          "manufacturingYear": "Manufacturing year as 4-digit number string, e.g. '2019'",
          "registerYear": "Registration year as 4-digit number string, e.g. '2019' (if text says 2019-12, return '2019')",
          "price": "Price as pure numbers without commas or currency symbol, e.g. '1070000' (from 10,70,000/-)",
          "kmDriven": "Kilometers driven as pure numbers, e.g. '72000' (from 72,000)",
          "fuelType": "One of: 'Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'",
          "transmission": "One of: 'Manual', 'Automatic'",
          "ownership": "Must be EXACTLY one of: '1st Owner', '2nd Owner', '3rd Owner', '4th Owner+', 'Unregistered'",
          "color": "Color in Title Case, e.g. 'White', 'Pearl White', 'Black', 'Silver', 'Grey', 'Red', 'Blue'",
          "registration": "Registration state/city code, e.g. 'GJ', 'GJ-05', 'MH-02', etc.",
          "insurance": "Insurance validity text, e.g. 'FULL (26-11-26)' or 'Comprehensive' or 'Third Party'",
          "bodyType": "One of: 'SUV', 'Sedan', 'Hatchback', 'MUV', 'Coupe', 'Convertible'",
          "displacement": "Engine displacement with 'cc', e.g. '1493 cc'",
          "maxPower": "Max power output with 'bhp', e.g. '113 bhp'",
          "driveType": "e.g. 'FWD', 'RWD', or '4WD'",
          "cylinders": "Number of cylinders as string, e.g. '4'",
          "airConditioner": "e.g. 'Automatic Climate Control' or 'Manual AC'",
          "powerWindows": "e.g. 'All 4 Windows' or 'Front Only'",
          "sunroof": "e.g. 'Electric Sunroof' or 'Panoramic Sunroof' or 'No'",
          "parkingSensors": "e.g. 'Rear Parking Sensors' or 'Front & Rear Sensors' or 'No'",
          "isCertified": true,
          "validVimo": true,
          "loanAvailable": true,
          "isKmGenuine": true,
          "features": [
            { "key": "Touchscreen", "value": "10.25-inch HD Display" },
            { "key": "Alloy Wheels", "value": "17-inch Diamond Cut" },
            { "key": "Sunroof", "value": "Electric Sunroof" },
            { "key": "Cruise Control", "value": "Yes" },
            { "key": "Rear AC Vents", "value": "Yes" },
            { "key": "Airbags", "value": "6 Airbags" },
            { "key": "LED Headlamps", "value": "LED DRLs & Projectors" },
            { "key": "Reverse Camera", "value": "With Dynamic Guidelines" },
            { "key": "Push Button Start", "value": "Smart Keyless Entry" }
          ],
          "description": "Certified dealership description, e.g. 'KIA SELTOS HTX in excellent condition. Certified by Sadguru Car Melo.'"
        }
      `;

      return await model.generateContent(prompt);
    });

    const rawJson = geminiResult.response.text().trim();
    const parsed = JSON.parse(rawJson);

    // Merge AI output with heuristic fallback to ensure all critical fields are guaranteed
    const rawMfgYear = String(parsed.manufacturingYear || fallback.manufacturingYear || '');
    const cleanMfgYear = (rawMfgYear.match(/\b(19\d\d|20\d\d)\b/) || [])[1] || rawMfgYear;

    const rawRegYear = String(parsed.registerYear || fallback.registerYear || '');
    const cleanRegYear = (rawRegYear.match(/\b(19\d\d|20\d\d)\b/) || [])[1] || rawRegYear;

    const finalData = {
      make: parsed.make || fallback.make || '',
      model: parsed.model || fallback.model || '',
      variant: parsed.variant || fallback.variant || '',
      manufacturingYear: cleanMfgYear,
      registerYear: cleanRegYear,
      price: parsed.price || fallback.price || '',
      kmDriven: parsed.kmDriven || fallback.kmDriven || '',
      fuelType: parsed.fuelType || fallback.fuelType || 'Petrol',
      transmission: parsed.transmission || fallback.transmission || 'Manual',
      ownership: normalizeOwnership(parsed.ownership || fallback.ownership),
      color: parsed.color || fallback.color || '',
      registration: parsed.registration || fallback.registration || 'GJ',
      insurance: parsed.insurance || fallback.insurance || '',
      bodyType: parsed.bodyType || fallback.bodyType || 'SUV',
      displacement: parsed.displacement || fallback.displacement || '',
      maxPower: parsed.maxPower || fallback.maxPower || '',
      driveType: parsed.driveType || fallback.driveType || 'FWD',
      cylinders: String(parsed.cylinders || fallback.cylinders || '4'),
      airConditioner: parsed.airConditioner || fallback.airConditioner || 'Automatic Climate Control',
      powerWindows: parsed.powerWindows || fallback.powerWindows || 'All 4 Windows',
      sunroof: parsed.sunroof || fallback.sunroof || 'No',
      parkingSensors: parsed.parkingSensors || fallback.parkingSensors || 'Rear Parking Sensors',
      isCertified: parsed.isCertified !== undefined ? parsed.isCertified : true,
      validVimo: parsed.validVimo !== undefined ? parsed.validVimo : fallback.validVimo,
      loanAvailable: parsed.loanAvailable !== undefined ? parsed.loanAvailable : true,
      isKmGenuine: parsed.isKmGenuine !== undefined ? parsed.isKmGenuine : true,
      features: Array.isArray(parsed.features) && parsed.features.length > 0 ? parsed.features : fallback.features,
      description: parsed.description || fallback.description || `${parsed.make || fallback.make} ${parsed.model || fallback.model} ${parsed.variant || fallback.variant} in excellent condition. Certified by Sadguru Car Melo.`,
      source: 'gemini'
    };

    return res.json({ success: true, data: finalData, source: 'gemini' });
  } catch (error) {
    console.warn('Gemini AI parse failed or keys exhausted, falling back to heuristic parser:', error.message);

    // Return the heuristic extraction so the user is NEVER blocked!
    return res.json({
      success: true,
      data: {
        ...fallback,
        ownership: normalizeOwnership(fallback.ownership),
        description: fallback.description || `${fallback.make} ${fallback.model} ${fallback.variant} in excellent condition. Certified by Sadguru Car Melo.`
      },
      source: 'heuristic',
      warning: `AI quota or network limit reached (${error.message}). Filled via smart pattern parser.`
    });
  }
});

// @route   GET /api/ai/settings
// @desc    Get configured Gemini API keys (masked) and status
// @access  Protected (Admin only)
router.get('/settings', protect, admin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ geminiApiKeys: [], geminiKeyStates: [] });
      await settings.save();
    }

    const maskedKeys = (settings.geminiApiKeys || []).map((k) => {
      if (!k) return '';
      if (k.length <= 8) return '****';
      return `${k.slice(0, 4)}...${k.slice(-4)}`;
    });

    res.json({
      success: true,
      data: {
        keys: settings.geminiApiKeys || [],
        maskedKeys,
        keyStates: settings.geminiKeyStates || []
      }
    });
  } catch (err) {
    console.error('Failed to get AI settings:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve AI settings' });
  }
});

// @route   PUT /api/ai/settings
// @desc    Save Gemini API keys
// @access  Protected (Admin only)
router.put('/settings', protect, admin, async (req, res) => {
  try {
    const { geminiApiKeys } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ geminiApiKeys: [], geminiKeyStates: [] });
    }

    if (Array.isArray(geminiApiKeys)) {
      const cleanKeys = geminiApiKeys.map((k) => (k || '').trim()).filter(Boolean);
      settings.geminiApiKeys = cleanKeys;

      // Reset invalid / exhausted states for modified keys
      settings.geminiKeyStates = cleanKeys.map((key) => {
        const existing = (settings.geminiKeyStates || []).find((s) => s.key === key);
        return existing || { key, isInvalid: false, exhaustedUntil: null, lastUsed: null };
      });

      await settings.save();
    }

    res.json({ success: true, message: 'Gemini API keys updated successfully', data: settings.geminiApiKeys });
  } catch (err) {
    console.error('Failed to update AI settings:', err);
    res.status(500).json({ success: false, message: 'Failed to update AI settings' });
  }
});

export default router;
