import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  uploadDataset,
  getDatasets,
  getDataset,
  deleteDataset,
  getDatasetData,
  exportDataset
} from '../controllers/datasetController.js';

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('file'), uploadDataset);
router.get('/', getDatasets);
router.get('/:id', getDataset);
router.delete('/:id', deleteDataset);
router.get('/:id/data', getDatasetData);
router.post('/:id/export', exportDataset);

export default router;