const { Sequelize } = require('sequelize');
require('./env');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Конфигурация подключения к базе данных
 */
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: isProduction ? false : console.log,
  pool: {
    max: isProduction ? 10 : 5,
    min: isProduction ? 2 : 0,
    acquire: 30000,
    idle: 10000
  }
};

// SSL конфигурация для production
if (isProduction && process.env.DB_SSL === 'true') {
  dbConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    }
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  dbConfig
);

module.exports = sequelize;

