import mongoose from 'mongoose';

const happyCustomerSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  reviewText: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.model('HappyCustomer', happyCustomerSchema);
