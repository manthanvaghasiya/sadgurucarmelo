import mongoose from 'mongoose';

const sellRequestSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    carBrand: {
      type: String,
      required: [true, 'Car brand is required'],
      trim: true,
    },
    carModel: {
      type: String,
      required: [true, 'Car model is required'],
      trim: true,
    },
    year: {
      type: Number,
      min: [1990, 'Year must be 1990 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    kmDriven: {
      type: Number,
      min: [0, 'KM driven cannot be negative'],
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
      default: 'Petrol',
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic'],
      default: 'Manual',
    },
    expectedPrice: {
      type: Number,
      min: [0, 'Expected price cannot be negative'],
    },
    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Contacted', 'Closed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

sellRequestSchema.index({ status: 1, createdAt: -1 });
sellRequestSchema.index({ phone: 1 });

const SellRequest = mongoose.model('SellRequest', sellRequestSchema);
export default SellRequest;
