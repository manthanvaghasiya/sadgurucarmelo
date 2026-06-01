import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getCarMasters,
  createCarMaster,
  updateCarMaster,
  deleteCarMaster
} from '../controllers/carMaster.controller.js';

const router = express.Router();

router.route('/')
  .get(protect, getCarMasters)
  .post(protect, admin, createCarMaster);

router.route('/:id')
  .put(protect, admin, updateCarMaster)
  .delete(protect, admin, deleteCarMaster);

export default router;
