import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getSystemStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getLogs,
  deleteLog
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, authorize('ADMIN'));

router.get('/stats', getSystemStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/logs', getLogs);
router.delete('/logs/:id', deleteLog);

export default router;