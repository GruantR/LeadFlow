/**
 * Инициализация Telegram бота
 */

const TelegramBot = require('node-telegram-bot-api');
const { config, validate } = require('./config');
const { setupCommands } = require('./commands');

let bot = null;

/**
 * Инициализирует Telegram бота
 */
function initialize() {
  if (!validate()) {
    console.warn('Telegram bot не будет инициализирован из-за отсутствия конфигурации');
    return null;
  }

  try {
    // Создаем экземпляр бота
    // Если нужен polling для команд, используем polling: true
    // Иначе polling: false для только отправки сообщений
    const pollingEnabled = config.polling;
    
    bot = new TelegramBot(config.token, {
      polling: pollingEnabled
    });

    // Настраиваем обработчики команд только если включен polling
    if (pollingEnabled) {
      setupCommands(bot);
      console.log('✓ Telegram bot инициализирован с polling (команды активны)');
    } else {
      console.log('✓ Telegram bot инициализирован (только отправка уведомлений)');
    }

    // Обработка ошибок
    bot.on('error', (error) => {
      console.error('Ошибка Telegram bot:', error.message);
    });

    // Обработка polling ошибок
    if (pollingEnabled) {
      bot.on('polling_error', (error) => {
        console.error('Ошибка polling Telegram bot:', error.message);
      });
    }

    return bot;
  } catch (error) {
    console.error('Ошибка при инициализации Telegram bot:', error.message);
    return null;
  }
}

/**
 * Получает экземпляр бота
 */
function getBot() {
  return bot;
}

/**
 * Останавливает бота
 */
function stop() {
  if (bot && config.polling) {
    bot.stopPolling();
    console.log('Telegram bot polling остановлен');
  }
}

module.exports = {
  initialize,
  getBot,
  stop
};

