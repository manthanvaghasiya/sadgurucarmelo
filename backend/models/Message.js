import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Unread', 'Read'],
      default: 'Unread',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
