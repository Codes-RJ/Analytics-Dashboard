import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getProfile,
  updateProfile,
  getUserStats
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/stats', getUserStats);

export default router;