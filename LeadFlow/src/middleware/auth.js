const AuthService = require('../services/authService');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Middleware для проверки JWT токена
 */
const authenticate = async (req, res, next) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Токен не предоставлен');
    }

    const token = authHeader.substring(7); // Убираем "Bearer "

    // Верифицируем токен
    const decoded = AuthService.verifyToken(token);

    // Находим пользователя
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw ApiError.unauthorized('Пользователь не найден');
    }

    // Добавляем пользователя в запрос
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(ApiError.unauthorized('Невалидный токен'));
  }
};

/**
 * Middleware для проверки роли (опционально, если нужно ограничить доступ)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Требуется аутентификация'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Недостаточно прав доступа'));
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireRole
};

