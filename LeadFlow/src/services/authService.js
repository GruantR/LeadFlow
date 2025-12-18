const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Сервис для работы с аутентификацией
 */
class AuthService {
  /**
   * Регистрация нового пользователя
   */
  static async register(email, password, role = 'admin') {
    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw ApiError.conflict('Пользователь с таким email уже существует');
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = await User.create({
      email,
      password: hashedPassword,
      role
    });

    // Генерируем токен
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  /**
   * Вход пользователя
   */
  static async login(email, password) {
    // Находим пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.unauthorized('Неверный email или пароль');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Неверный email или пароль');
    }

    // Генерируем токен
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  /**
   * Генерация JWT токена
   */
  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    );
  }

  /**
   * Верификация JWT токена
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw ApiError.unauthorized('Невалидный токен');
    }
  }
}

module.exports = AuthService;

