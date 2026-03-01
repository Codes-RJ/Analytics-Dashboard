import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  descriptiveStats,
  correlationMatrix,
  regressionAnalysis,
  pivotTable,
  timeSeriesAnalysis,
  outlierDetection,
  missingValueHandler,
  customQuery
} from '../controllers/analyticsController.js';

const router = express.Router();

router.use(protect);

router.post('/descriptive', descriptiveStats);
router.post('/correlation', correlationMatrix);
router.post('/regression', regressionAnalysis);
router.post('/pivot', pivotTable);
router.post('/timeseries', timeSeriesAnalysis);
router.post('/outliers', outlierDetection);
router.post('/missing', missingValueHandler);
router.post('/query', customQuery);

export default router;