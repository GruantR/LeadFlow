const Application = require('../models/Application');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

/**
 * Получение всех заявок с пагинацией и фильтрами
 */
const getApplications = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Формируем условия фильтрации
    const where = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.createdAt[Op.lte] = new Date(endDate);
      }
    }

    // Получаем заявки с пагинацией
    const { count, rows } = await Application.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        applications: rows,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count,
          pages: Math.ceil(count / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получение конкретной заявки по ID
 */
const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id);

    if (!application) {
      throw ApiError.notFound('Заявка не найдена');
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление статуса заявки
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByPk(id);

    if (!application) {
      throw ApiError.notFound('Заявка не найдена');
    }

    // Валидация статуса
    const validStatuses = ['new', 'in_progress', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw ApiError.badRequest('Недопустимый статус');
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: 'Статус заявки обновлен',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получение статистики по заявкам
 */
const getStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Формируем условия для фильтрации по дате
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.createdAt[Op.lte] = new Date(endDate);
      }
    }

    // Получаем общее количество заявок
    const total = await Application.count({ where });

    // Получаем количество заявок по статусам
    const statusCounts = {
      new: 0,
      in_progress: 0,
      completed: 0,
      rejected: 0,
      total: total
    };

    // Подсчитываем заявки по каждому статусу
    const statuses = ['new', 'in_progress', 'completed', 'rejected'];
    for (const status of statuses) {
      const count = await Application.count({
        where: {
          ...where,
          status
        }
      });
      statusCounts[status] = count;
    }

    res.json({
      success: true,
      data: statusCounts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  getStats
};

