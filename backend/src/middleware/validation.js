import { body } from 'express-validator';

export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').optional().trim().isLength({ min: 2 })
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

export const validateDataset = [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 })
];

export const validateLayout = [
  body('name').trim().isLength({ min: 1, max: 50 }),
  body('layout').isArray()
];