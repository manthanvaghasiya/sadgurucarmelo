import mongoose from 'mongoose';

const promoPosterSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
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
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

promoPosterSchema.index({ isActive: 1, order: 1 });

export default mongoose.model('PromoPoster', promoPosterSchema);
