import mongoose from 'mongoose';

const promoPosterSchema = new mongoose.Schema({
  desktopImageUrl: {
    type: String,
    required: true,
  },
  mobileImageUrl: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export default mongoose.model('PromoPoster', promoPosterSchema);
