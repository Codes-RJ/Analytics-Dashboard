import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLayouts = async (req, res, next) => {
  try {
    const layouts = await prisma.dashboardLayout.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(layouts);
  } catch (error) {
    next(error);
  }
};

export const createLayout = async (req, res, next) => {
  try {
    const { name, layout } = req.body;

    const newLayout = await prisma.dashboardLayout.create({
      data: {
        name,
        layout,
        userId: req.user.id
      }
    });

    // Log action
    await prisma.log.create({
      data: {
        action: 'CREATE_LAYOUT',
        details: { layoutId: newLayout.id, name },
        userId: req.user.id
      }
    });

    res.status(201).json(newLayout);
  } catch (error) {
    next(error);
  }
};

export const updateLayout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, layout } = req.body;

    const existingLayout = await prisma.dashboardLayout.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!existingLayout) {
      return res.status(404).json({ message: 'Layout not found' });
    }

    const updatedLayout = await prisma.dashboardLayout.update({
      where: { id },
      data: { name, layout }
    });

    // Log action
    await prisma.log.create({
      data: {
        action: 'UPDATE_LAYOUT',
        details: { layoutId: id, name },
        userId: req.user.id
      }
    });

    res.json(updatedLayout);
  } catch (error) {
    next(error);
  }
};

export const deleteLayout = async (req, res, next) => {
  try {
    const { id } = req.params;

    const layout = await prisma.dashboardLayout.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!layout) {
      return res.status(404).json({ message: 'Layout not found' });
    }

    await prisma.dashboardLayout.delete({ where: { id } });

    // Log action
    await prisma.log.create({
      data: {
        action: 'DELETE_LAYOUT',
        details: { layoutId: id, name: layout.name },
        userId: req.user.id
      }
    });

    res.json({ message: 'Layout deleted successfully' });
  } catch (error) {
    next(error);
  }
};