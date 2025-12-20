/**
 * Конфигурация Telegram бота
 */

require('dotenv').config();

const config = {
  token: process.env.TELEGRAM_BOT_TOKEN,
  chatId: process.env.TELEGRAM_CHAT_ID,
  polling: process.env.TELEGRAM_POLLING === 'true' || false,
  options: {
    polling: {
      interval: 300,
      autoStart: false,
      params: {
        timeout: 10
      }
    }
  }
};

/**
 * Проверяет, настроен ли бот
 */
function isConfigured() {
  return !!(config.token && config.chatId);
}

/**
 * Валидирует конфигурацию
 */
function validate() {
  if (!config.token) {
    console.warn('⚠️  TELEGRAM_BOT_TOKEN не установлен в переменных окружения');
    return false;
  }
  
  if (!config.chatId) {
    console.warn('⚠️  TELEGRAM_CHAT_ID не установлен в переменных окружения');
    return false;
  }
  
  return true;
}

module.exports = {
  config,
  isConfigured,
  validate
};

