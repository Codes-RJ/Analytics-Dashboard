import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const forwardToAnalyticsEngine = async (req, res, next, endpoint) => {
  try {
    const { datasetId, ...params } = req.body;

    // Get dataset info
    const dataset = await prisma.dataset.findFirst({
      where: {
        id: datasetId,
        ...(req.user.role !== 'ADMIN' && { userId: req.user.id })
      }
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Forward request to analytics engine
    const response = await axios.post(
      `${process.env.ANALYTICS_ENGINE_URL}${endpoint}`,
      { file_path: dataset.filePath, ...params }
    );

    // Log action
    await prisma.log.create({
      data: {
        action: `ANALYTICS_${endpoint.toUpperCase().replace('/', '_')}`,
        details: { datasetId, endpoint },
        userId: req.user.id,
        datasetId
      }
    });

    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // Error from analytics engine
      res.status(error.response.status).json(error.response.data);
    } else {
      next(error);
    }
  }
};

export const descriptiveStats = (req, res, next) => 
  forwardToAnalyticsEngine(req, res, next, '/statistics');

export const correlationMatrix = (req, res, next) => 
  forwardToAnalyticsEngine(req, res, next, '/correlation');

export const regressionAnalysis = (req, res, next) => 
  forwardToAnalyticsEngine(req, res, next, '/regression');

export const pivotTable = (req, res, next) => 
  forwardToAnalyticsEngine(req, res, next, '/pivot');

export const timeSeriesAnalysis = (req, res, next) => 
  forwardToAnalyticsEngine(req, res, next, '/timeseries');

export const outlierDetection = (req, res, next) => 
  forwardToAnalyticsEngine(req, res, next, '/outliers');

export const missingValueHandler = (req, res, next) => 
  forwardToAnalyticsEngine(req, res, next, '/missing');

export const customQuery = (req, res, next) => 
  forwardToAnalyticsEngine(req, res, next, '/query');