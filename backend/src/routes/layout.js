import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getLayouts,
  createLayout,
  updateLayout,
  deleteLayout
} from '../controllers/layoutController.js';

const router = express.Router();

router.use(protect);

router.get('/', getLayouts);
router.post('/', createLayout);
router.put('/:id', updateLayout);
router.delete('/:id', deleteLayout);

export default router;