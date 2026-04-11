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
      min: [1990, 'Year must be 1990 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    price: {
      type: Number,
      min: [0, 'Price must be positive'],
    },
    kms: {
      type: Number,
      min: [0, 'KMs must be positive'],
    },

    // ── Specs ──
    fuelType: {
      type: String,
      enum: {
        values: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
        message: '{VALUE} is not a supported fuel type',
      },
    },
    transmission: {
      type: String,
      enum: {
        values: ['Manual', 'Automatic'],
        message: '{VALUE} is not a supported transmission',
      },
    },
    bodyType: {
      type: String,
      trim: true,
    },
    variantTier: {
      type: String,
      enum: {
        values: ['Top', 'Medium', 'Low', ''],
        message: '{VALUE} is not a valid variant tier'
      },
      default: '',
    },
    color: {
      type: String,
      trim: true,
    },
    registration: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: String,
      enum: ['1st Owner', '2nd Owner', '3rd Owner', '4th Owner+', 'Unregistered'],
      default: '1st Owner',
    },

    // ── Badges & Certifications ──
    features: {
      type: [String],
      default: [],
    },
    
    // ── Comfort Features ──
    airConditioner: { type: String, trim: true },
    powerWindows: { type: String, trim: true },
    sunroof: { type: String, trim: true },
    parkingSensors: { type: String, trim: true },

    // ── Engine & Performance ──
    displacement: { type: String, trim: true },
    maxPower: { type: String, trim: true },
    driveType: { type: String, trim: true },
    cylinders: { type: Number },

    badges: {
      type: [String],
      default: [],
    },

    // ── Media ──
    image: {
      type: String, // Single hero image
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    spinImages: {
      type: [String], // Array of URLs for 360° spin
      default: [],
    },
    vr360Image: {
      type: String, // Single panorama URL
      default: '',
    },

    // ── Status & Offers ──
    status: {
      type: String,
      enum: {
        values: ['Available', 'Booked', 'Sold', 'Coming Soon'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Available',
    },
    loanAvailable: {
      type: Boolean,
      default: false,
    },

    // ── Home Page Featured ──
    isFeaturedOnHome: {
      type: Boolean,
      default: false,
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
carSchema.pre('save', function () {
  if (!this.title) {
    this.title = `${this.make} ${this.model} (${this.year})`;
  }
});

// ── Index for common queries ──
carSchema.index({ status: 1, createdAt: -1 });
carSchema.index({ make: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ isFeaturedOnHome: 1 });

const Car = mongoose.model('Car', carSchema);
export default Car;
