import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  geminiApiKeys: [{ type: String }],
  geminiKeyStates: [{
    key: { type: String, required: true },
    exhaustedUntil: { type: Date, default: null },
    isInvalid: { type: Boolean, default: false },
    lastUsed: { type: Date, default: null }
  }]
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
