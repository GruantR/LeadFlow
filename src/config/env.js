/**
 * Загрузчик конфигурации окружения
 * Загружает соответствующий .env файл в зависимости от NODE_ENV
 */

const path = require('path');
const fs = require('fs');

/**
 * Определяет текущее окружение
 */
function getEnvironment() {
  return process.env.NODE_ENV || 'development';
}

/**
 * Загружает конфигурацию окружения
 */
function loadEnvConfig() {
  const env = getEnvironment();
  const envFile = `.env.${env}`;
  const envPath = path.resolve(process.cwd(), envFile);

  // Проверяем существование файла
  if (!fs.existsSync(envPath)) {
    console.warn(`⚠️  Файл ${envFile} не найден. Используется .env`);
    // Fallback на стандартный .env
    require('dotenv').config();
    return;
  }

  // Загружаем соответствующий env файл
  require('dotenv').config({ path: envPath });
  console.log(`✓ Загружена конфигурация из ${envFile}`);
}

// Загружаем конфигурацию при импорте модуля
loadEnvConfig();

module.exports = {
  getEnvironment,
  loadEnvConfig
};

