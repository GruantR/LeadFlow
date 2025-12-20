const AuthService = require('../services/authService');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Вход пользователя
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.json({
      success: true,
      message: 'Успешный вход',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получение данных текущего пользователя
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      throw ApiError.notFound('Пользователь не найден');
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe
};

