const ApiError = require('../utils/ApiError');
const { ValidationError, UniqueConstraintError } = require('sequelize');

/**
 * Middleware для обработки ошибок
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Если ошибка не является экземпляром ApiError, преобразуем её
  if (!(error instanceof ApiError)) {
    // Обработка ошибок Sequelize
    if (error instanceof ValidationError) {
      const errors = error.errors.map(e => ({
        field: e.path,
        message: e.message
      }));
      error = ApiError.badRequest('Ошибка валидации', errors);
    } else if (error instanceof UniqueConstraintError) {
      const errors = error.errors.map(e => ({
        field: e.path,
        message: 'Значение должно быть уникальным'
      }));
      error = ApiError.conflict('Конфликт данных', errors);
    } else if (error.name === 'JsonWebTokenError') {
      error = ApiError.unauthorized('Невалидный токен');
    } else if (error.name === 'TokenExpiredError') {
      error = ApiError.unauthorized('Токен истек');
    } else {
      // Неизвестная ошибка
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Внутренняя ошибка сервера';
      error = new ApiError(statusCode, message);
    }
  }

  // Логируем ошибку в development режиме
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  // Отправляем ответ
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

/**
 * Middleware для обработки 404 ошибок
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Маршрут ${req.originalUrl} не найден`));
};

module.exports = {
  errorHandler,
  notFoundHandler
};

