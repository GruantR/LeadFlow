const sequelize = require('./database');
const User = require('../models/User');
const Application = require('../models/Application');

/**
 * Синхронизация моделей с базой данных
 * Создает таблицы, если они не существуют
 */
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✓ Подключение к базе данных установлено.');

    // Определяем связи между моделями
    // User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
    // Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    // Синхронизация моделей
    await sequelize.sync({ alter: false, force: false });
    console.log('✓ Модели синхронизированы с базой данных.');

    process.exit(0);
  } catch (error) {
    console.error('✗ Ошибка синхронизации базы данных:', error);
    process.exit(1);
  }
}

syncDatabase();

