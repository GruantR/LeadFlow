const Application = require('../models/Application');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

/**
 * Создание новой заявки (публичный эндпоинт)
 */
const createApplication = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      comment,
      utm_source,
      utm_medium,
      utm_campaign
    } = req.body;

    // Получаем IP адрес и User-Agent
    const ipAddress = req.ip || 
                     req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const application = await Application.create({
      name,
      phone,
      email: email || null,
      comment: comment || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      ip_address: ipAddress,
      user_agent: userAgent,
      status: 'new'
    });

    res.status(201).json({
      success: true,
      message: 'Заявка успешно создана',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication
};

