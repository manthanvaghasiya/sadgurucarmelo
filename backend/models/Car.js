import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    // ── Core Details ──
    title: {
      type: String,
      trim: true,
    },
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1990, 'Year must be 1990 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    kms: {
      type: Number,
      required: [true, 'Kilometer reading is required'],
      min: [0, 'KMs must be positive'],
    },

    // ── Specs ──
    fuelType: {
      type: String,
      enum: {
        values: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
        message: '{VALUE} is not a supported fuel type',
      },
      required: [true, 'Fuel type is required'],
    },
    transmission: {
      type: String,
      enum: {
        values: ['Manual', 'Automatic', 'CVT', 'DCT', 'AMT', 'iMT'],
        message: '{VALUE} is not a supported transmission',
      },
      required: [true, 'Transmission is required'],
    },
    owner: {
      type: String,
      enum: ['1st Owner', '2nd Owner', '3rd Owner', '4th Owner+', 'Unregistered'],
      default: '1st Owner',
    },

    // ── Badges & Certifications ──
    badges: {
      type: [String],
      default: [],
    },

    // ── Media ──
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    vr360Image: {
      type: String, // Single panorama URL
      default: '',
    },

    // ── Status ──
    status: {
      type: String,
      enum: {
        values: ['Available', 'Sold', 'Coming Soon'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Available',
    },

    // ── Meta ──
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// ── Virtual: Auto-generate title if not set ──
carSchema.pre('save', function (next) {
  if (!this.title) {
    this.title = `${this.year} ${this.make} ${this.model}`;
  }
  next();
});

// ── Index for common queries ──
carSchema.index({ status: 1, createdAt: -1 });
carSchema.index({ make: 1, model: 1 });
carSchema.index({ price: 1 });

const Car = mongoose.model('Car', carSchema);
export default Car;
