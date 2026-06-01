import CarMaster from '../models/CarMaster.js';

export const getCarMasters = async (req, res) => {
  try {
    const carMasters = await CarMaster.find().sort({ brand: 1 });
    res.json({ success: true, data: carMasters });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCarMaster = async (req, res) => {
  try {
    const { brand, models } = req.body;

    let carMaster = await CarMaster.findOne({ brand: new RegExp(`^${brand}$`, 'i') });
    
    if (carMaster) {
      // Merge models if it already exists
      const existingModels = carMaster.models || [];
      const newModels = models || [];
      const combined = [...new Set([...existingModels, ...newModels])];
      carMaster.models = combined;
      await carMaster.save();
      return res.status(200).json({ success: true, data: carMaster, message: 'Brand already exists, models merged successfully.' });
    }

    carMaster = await CarMaster.create({ brand, models: models || [] });
    res.status(201).json({ success: true, data: carMaster });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCarMaster = async (req, res) => {
  try {
    const { brand, models } = req.body;
    
    // Check if we're trying to rename to an existing brand
    const existing = await CarMaster.findOne({ brand: new RegExp(`^${brand}$`, 'i'), _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Another brand with this name already exists' });
    }

    const carMaster = await CarMaster.findByIdAndUpdate(
      req.params.id,
      { brand, models },
      { new: true, runValidators: true }
    );

    if (!carMaster) {
      return res.status(404).json({ success: false, message: 'Car Master not found' });
    }
    res.json({ success: true, data: carMaster });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCarMaster = async (req, res) => {
  try {
    const carMaster = await CarMaster.findById(req.params.id);
    if (!carMaster) {
      return res.status(404).json({ success: false, message: 'Car Master not found' });
    }

    await carMaster.deleteOne();
    res.json({ success: true, message: 'Car Master deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
