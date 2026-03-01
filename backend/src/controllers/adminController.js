import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSystemStats = async (req, res, next) => {
  try {
    const [userCount, datasetCount, layoutCount, logCount] = await Promise.all([
      prisma.user.count(),
      prisma.dataset.count(),
      prisma.dashboardLayout.count(),
      prisma.log.count()
    ]);

    // Get recent activity
    const recentLogs = await prisma.log.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, name: true } },
        dataset: { select: { name: true } }
      }
    });

    res.json({
      users: userCount,
      datasets: datasetCount,
      layouts: layoutCount,
      logs: logCount,
      recentActivity: recentLogs
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            datasets: true,
            dashboardLayouts: true,
            logs: true
          }
        }
      }
    });

    const total = await prisma.user.count();

    res.json({
      users,
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

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['ADMIN', 'USER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    // Log action
    await prisma.log.create({
      data: {
        action: 'UPDATE_USER_ROLE',
        details: { userId: id, newRole: role },
        userId: req.user.id
      }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await prisma.user.delete({ where: { id } });

    // Log action
    await prisma.log.create({
      data: {
        action: 'DELETE_USER',
        details: { userId: id },
        userId: req.user.id
      }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const logs = await prisma.log.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, name: true } },
        dataset: { select: { name: true } }
      }
    });

    const total = await prisma.log.count();

    res.json({
      logs,
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

export const deleteLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.log.delete({ where: { id } });

    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    next(error);
  }
};