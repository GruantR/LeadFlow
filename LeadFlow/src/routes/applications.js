const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const validate = require('../middleware/validate');

/**
 * Валидация номера телефона (базовая)
 */
const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Создание новой заявки (публичный эндпоинт)
 *     tags: [Applications]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Иван Иванов
 *               phone:
 *                 type: string
 *                 maxLength: 20
 *                 example: +79991234567
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 100
 *                 example: ivan@example.com
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Хочу узнать больше о ваших услугах
 *               utm_source:
 *                 type: string
 *                 maxLength: 100
 *                 example: google
 *               utm_medium:
 *                 type: string
 *                 maxLength: 100
 *                 example: cpc
 *               utm_campaign:
 *                 type: string
 *                 maxLength: 100
 *                 example: summer_sale
 *     responses:
 *       201:
 *         description: Заявка успешно создана
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
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Имя должно содержать от 2 до 100 символов')
      .notEmpty()
      .withMessage('Имя обязательно для заполнения'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Телефон обязателен для заполнения')
      .matches(phoneRegex)
      .withMessage('Некорректный формат телефона'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email должен быть валидным')
      .normalizeEmail(),
    body('comment')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Комментарий не должен превышать 1000 символов'),
    body('utm_source')
      .optional()
      .isLength({ max: 100 })
      .withMessage('utm_source не должен превышать 100 символов'),
    body('utm_medium')
      .optional()
      .isLength({ max: 100 })
      .withMessage('utm_medium не должен превышать 100 символов'),
    body('utm_campaign')
      .optional()
      .isLength({ max: 100 })
      .withMessage('utm_campaign не должен превышать 100 символов')
  ],
  validate,
  applicationController.createApplication
);

module.exports = router;

