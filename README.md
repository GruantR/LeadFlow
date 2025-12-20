# LeadFlow API

REST API для системы обработки заявок на Node.js + Express + Sequelize + PostgreSQL.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Настройте переменные окружения:
   
   Проект использует отдельные файлы конфигурации для разных окружений:
   - `.env.development` - для разработки
   - `.env.production` - для production
   
   Скопируйте и заполните соответствующий файл:
   ```bash
   # Для development
   cp .env.development .env.development
   
   # Для production
   cp .env.production .env.production
   ```
   
   **Важно:** Файл конфигурации выбирается автоматически на основе переменной `NODE_ENV`. 
   Если `NODE_ENV` не установлена, используется `development` по умолчанию.

3. Создайте базу данных PostgreSQL и укажите параметры подключения в соответствующем `.env` файле

4. Запустите миграции для создания таблиц:
```bash
npm run migrate
```

5. Запустите сиды для создания тестового админа:
```bash
npm run seed
```

## Запуск

### Development режим:
```bash
# С nodemon (автоперезагрузка при изменениях)
npm run dev:development
# или просто
npm run dev

# Без nodemon
npm run start:dev
```

### Production режим:
```bash
# Запуск production сервера
npm run start:prod

# Или через стандартную команду (если NODE_ENV установлен в системе)
npm start
```

### Дополнительные команды:

**Миграции базы данных:**
```bash
npm run migrate:dev    # Development окружение
npm run migrate:prod   # Production окружение
npm run migrate        # Использует NODE_ENV из системы или development по умолчанию
```

**Заполнение базы данных (сиды):**
```bash
npm run seed:dev       # Development окружение
npm run seed:prod      # Production окружение
npm run seed           # Использует NODE_ENV из системы или development по умолчанию
```

**Примечание:** При запуске приложение автоматически загрузит конфигурацию из соответствующего файла:
- `NODE_ENV=development` → `.env.development`
- `NODE_ENV=production` → `.env.production`
- Если файл не найден, используется стандартный `.env` (fallback)

## API Документация

После запуска сервера документация Swagger доступна по адресу:
- http://localhost:3000/api-docs

## Структура проекта

```
src/
├── config/          # Конфигурация (БД, env, swagger)
│   ├── env.js       # Загрузчик конфигурации окружения
│   └── database.js  # Конфигурация подключения к БД
├── controllers/     # Контроллеры
├── middleware/      # Middleware (auth, error handling, validation)
├── models/          # Sequelize модели
├── routes/          # Роуты
├── services/        # Бизнес-логика
├── telegram/        # Telegram Bot модуль
│   ├── bot.js       # Инициализация бота
│   ├── commands.js  # Обработчики команд (/start, /help)
│   ├── config.js    # Конфигурация бота
│   ├── service.js   # Сервис для отправки уведомлений
│   └── index.js     # Экспорт модуля
├── utils/           # Утилиты
└── app.js           # Главный файл приложения
```

## Тестовый админ

После выполнения `npm run seed` создается тестовый админ:
- Email: admin@example.com
- Password: admin123

## Telegram Bot Integration

Проект интегрирован с Telegram-ботом для автоматической отправки уведомлений о новых заявках.

### Настройка Telegram-бота

1. Создайте бота через [@BotFather](https://t.me/BotFather) в Telegram
2. Получите токен бота
3. Добавьте бота в вашу Telegram-группу
4. Получите Chat ID группы (можно использовать бота [@userinfobot](https://t.me/userinfobot) или [@getidsbot](https://t.me/getidsbot))
5. Укажите токен и Chat ID в соответствующем файле `.env.development` или `.env.production`:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_chat_id
   TELEGRAM_POLLING=true  # Включить polling для обработки команд (опционально)
   ```

**Примечание:** Если `TELEGRAM_POLLING=true`, бот будет обрабатывать команды (например, `/start`). Если `false` или не указано, бот будет только отправлять уведомления.

### Формат уведомлений

При создании новой заявки в Telegram отправляется сообщение с:
- Имя клиента
- Телефон
- Email (если указан)
- Комментарий (если указан)
- Статус заявки
- UTM метки (если указаны)
- ID заявки
- Дата создания

**Примечание:** Если Telegram-бот не настроен, приложение продолжит работать нормально, но уведомления отправляться не будут.

### Команды бота

Если включен polling (`TELEGRAM_POLLING=true`), бот поддерживает следующие команды:

- `/start` - Приветственное сообщение
- `/help` - Справка по использованию бота

Команды работают как в личных сообщениях с ботом, так и в группе, где добавлен бот.

