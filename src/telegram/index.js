/**
 * Telegram Bot Module
 * 
 * Модуль для работы с Telegram-ботом и отправки уведомлений
 */

const { initialize, getBot, stop } = require('./bot');
const telegramService = require('./service');
const { config, isConfigured, validate } = require('./config');

module.exports = {
  // Инициализация и управление ботом
  initialize,
  getBot,
  stop,
  // Сервис для отправки уведомлений
  telegramService,
  // Конфигурация
  config,
  isConfigured,
  validate
};

