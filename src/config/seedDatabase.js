const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sequelize = require('./database');

/**
 * Создание тестового админа
 */
async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✓ Подключение к базе данных установлено.');

    // Проверяем, существует ли уже админ
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (existingAdmin) {
      console.log('⚠ Тестовый админ уже существует.');
      process.exit(0);
    }

    // Создаем тестового админа
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✓ Тестовый админ создан:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('✗ Ошибка создания тестового админа:', error);
    process.exit(1);
  }
}

seedDatabase();

