# LeadFlow API

REST API для системы обработки заявок на Node.js + Express + Sequelize + PostgreSQL.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` на основе `.env.example` и заполните переменные окружения:
```bash
cp .env.example .env
```

3. Создайте базу данных PostgreSQL и укажите параметры подключения в `.env`

4. Запустите миграции для создания таблиц:
```bash
npm run migrate
```

5. Запустите сиды для создания тестового админа:
```bash
npm run seed
```

## Запуск

Development режим:
```bash
npm run dev
```

Production режим:
```bash
npm start
```

## API Документация

После запуска сервера документация Swagger доступна по адресу:
- http://localhost:3000/api-docs

## Структура проекта

```
src/
├── config/          # Конфигурация БД
├── controllers/     # Контроллеры
├── middleware/      # Middleware (auth, error handling, validation)
├── models/          # Sequelize модели
├── routes/          # Роуты
├── services/        # Бизнес-логика
├── utils/           # Утилиты
└── app.js           # Главный файл приложения
```

## Тестовый админ

После выполнения `npm run seed` создается тестовый админ:
- Email: admin@example.com
- Password: admin123

