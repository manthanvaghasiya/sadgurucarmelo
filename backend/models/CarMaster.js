import mongoose from 'mongoose';

const carMasterSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      unique: true,
      trim: true,
    },
    models: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CarMaster = mongoose.model('CarMaster', carMasterSchema);
export default CarMaster;
