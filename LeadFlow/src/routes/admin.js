const express = require('express');
const { body, query, param } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /api/admin/applications:
 *   get:
 *     summary: Получение всех заявок с пагинацией
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Количество записей на странице
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, in_progress, completed, rejected]
 *         description: Фильтр по статусу
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Дата начала периода
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Дата окончания периода
 *     responses:
 *       200:
 *         description: Список заявок
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     applications:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Application'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/applications',
  authenticate,
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Страница должна быть положительным числом'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Лимит должен быть от 1 до 100'),
    query('status')
      .optional()
      .isIn(['new', 'in_progress', 'completed', 'rejected'])
      .withMessage('Недопустимый статус'),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Некорректный формат даты начала'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('Некорректный формат даты окончания')
  ],
  validate,
  adminController.getApplications
);

/**
 * @swagger
 * /api/admin/applications/{id}:
 *   get:
 *     summary: Получение конкретной заявки
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заявки
 *     responses:
 *       200:
 *         description: Данные заявки
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Заявка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/applications/:id',
  authenticate,
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID должен быть положительным числом')
  ],
  validate,
  adminController.getApplicationById
);

/**
 * @swagger
 * /api/admin/applications/{id}:
 *   patch:
 *     summary: Обновление статуса заявки
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заявки
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, in_progress, completed, rejected]
 *                 example: in_progress
 *     responses:
 *       200:
 *         description: Статус заявки обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Application'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Заявка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
  '/applications/:id',
  authenticate,
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID должен быть положительным числом'),
    body('status')
      .isIn(['new', 'in_progress', 'completed', 'rejected'])
      .withMessage('Статус должен быть: new, in_progress, completed или rejected')
      .notEmpty()
      .withMessage('Статус обязателен для заполнения')
  ],
  validate,
  adminController.updateApplicationStatus
);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Получение статистики по заявкам
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Дата начала периода
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Дата окончания периода
 *     responses:
 *       200:
 *         description: Статистика по заявкам
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     new:
 *                       type: integer
 *                       example: 10
 *                     in_progress:
 *                       type: integer
 *                       example: 5
 *                     completed:
 *                       type: integer
 *                       example: 20
 *                     rejected:
 *                       type: integer
 *                       example: 2
 *                     total:
 *                       type: integer
 *                       example: 37
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/stats',
  authenticate,
  [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Некорректный формат даты начала'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('Некорректный формат даты окончания')
  ],
  validate,
  adminController.getStats
);

module.exports = router;

