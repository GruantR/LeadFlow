require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const sequelize = require('./config/database');
const swaggerSpec = require('./config/swaggerSpec');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { initialize: initializeTelegramBot } = require('./telegram');

// Роуты
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy для получения реального IP адреса
app.set('trust proxy', true);

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'LeadFlow API Documentation'
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Подключение к базе данных и запуск сервера
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✓ Подключение к базе данных установлено.');

    // Инициализация Telegram бота
    initializeTelegramBot();

    app.listen(PORT, () => {
      console.log(`✓ Сервер запущен на порту ${PORT}`);
      console.log(`✓ Swagger документация: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('✗ Ошибка подключения к базе данных:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;

