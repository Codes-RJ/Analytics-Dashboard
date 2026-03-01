import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { processUpload } from '../utils/fileProcessor.js';

const prisma = new PrismaClient();

export const uploadDataset = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { name, description } = req.body;
    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Process file to get metadata
    const stats = await processUpload(filePath);

    const dataset = await prisma.dataset.create({
      data: {
        name: name || fileName,
        description,
        fileName,
        filePath,
        rowCount: stats.rowCount,
        columns: stats.columns,
        userId: req.user.id
      }
    });

    // Log action
    await prisma.log.create({
      data: {
        action: 'UPLOAD',
        details: { 
          datasetId: dataset.id, 
          rows: stats.rowCount,
          fileName 
        },
        userId: req.user.id,
        datasetId: dataset.id
      }
    });

    res.status(201).json(dataset);
  } catch (error) {
    // Clean up uploaded file if error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

export const getDatasets = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };

    const datasets = await prisma.dataset.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    });

    const total = await prisma.dataset.count({ where });

    res.json({
      datasets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getDataset = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dataset = await prisma.dataset.findFirst({
      where: {
        id,
        ...(req.user.role !== 'ADMIN' && { userId: req.user.id })
      },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    res.json(dataset);
  } catch (error) {
    next(error);
  }
};

export const deleteDataset = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dataset = await prisma.dataset.findFirst({
      where: {
        id,
        ...(req.user.role !== 'ADMIN' && { userId: req.user.id })
      }
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Delete file
    if (fs.existsSync(dataset.filePath)) {
      fs.unlinkSync(dataset.filePath);
    }

    await prisma.dataset.delete({ where: { id } });

    // Log action
    await prisma.log.create({
      data: {
        action: 'DELETE_DATASET',
        details: { datasetId: id, name: dataset.name },
        userId: req.user.id
      }
    });

    res.json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getDatasetData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50, sort, order, filters } = req.query;

    const dataset = await prisma.dataset.findFirst({
      where: {
        id,
        ...(req.user.role !== 'ADMIN' && { userId: req.user.id })
      }
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Call analytics engine for data
    const response = await axios.post(`${process.env.ANALYTICS_ENGINE_URL}/data`, {
      file_path: dataset.filePath,
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      order,
      filters: filters ? JSON.parse(filters) : {}
    });

    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

export const exportDataset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { format = 'csv' } = req.body;

    const dataset = await prisma.dataset.findFirst({
      where: {
        id,
        ...(req.user.role !== 'ADMIN' && { userId: req.user.id })
      }
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Call analytics engine for export
    const response = await axios.post(
      `${process.env.ANALYTICS_ENGINE_URL}/export`,
      { file_path: dataset.filePath, format },
      { responseType: 'stream' }
    );

    res.setHeader('Content-Disposition', `attachment; filename=export.${format}`);
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    next(error);
  }
};