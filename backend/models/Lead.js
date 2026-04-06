import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    // ── Customer Info ──
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
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
      lowercase: true,
    },

    // ── Vehicle Interest ──
    carOfInterest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      default: null,
    },
    budgetRange: {
      type: String,
      trim: true,
    },

    // ── CRM Data ──
    source: {
      type: String,
      enum: {
        values: ['WhatsApp', 'Walk-in', 'Phone', 'Website'],
        message: '{VALUE} is not a valid lead source',
      },
      default: 'Website',
    },
    urgency: {
      type: String,
      enum: {
        values: ['Hot', 'Warm', 'Cold'],
        message: '{VALUE} is not a valid urgency level',
      },
      default: 'Warm',
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Follow-up', 'Closed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'New',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    // ── Follow-up Reminder ──
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes for dashboard queries ──
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ urgency: 1 });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
