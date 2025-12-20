require('./env');
const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3000;

/**
 * Конфигурация Swagger/OpenAPI
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LeadFlow API',
      version: '1.0.0',
      description: 'REST API для системы обработки заявок',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'https://leadflow-9v3y.onrender.com',
        description: 'Production server',
      },
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Эндпоинты аутентификации'
      },
      {
        name: 'Applications',
        description: 'Публичные эндпоинты для создания заявок'
      },
      {
        name: 'Admin',
        description: 'Административные эндпоинты (требуют авторизации)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введите JWT токен в формате: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID пользователя'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email пользователя'
            },
            role: {
              type: 'string',
              enum: ['admin', 'manager'],
              description: 'Роль пользователя'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Application: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID заявки'
            },
            name: {
              type: 'string',
              maxLength: 100,
              description: 'Имя клиента'
            },
            phone: {
              type: 'string',
              maxLength: 20,
              description: 'Телефон клиента'
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 100,
              nullable: true,
              description: 'Email клиента'
            },
            comment: {
              type: 'string',
              maxLength: 1000,
              nullable: true,
              description: 'Комментарий'
            },
            status: {
              type: 'string',
              enum: ['new', 'in_progress', 'completed', 'rejected'],
              default: 'new',
              description: 'Статус заявки'
            },
            utm_source: {
              type: 'string',
              maxLength: 100,
              nullable: true
            },
            utm_medium: {
              type: 'string',
              maxLength: 100,
              nullable: true
            },
            utm_campaign: {
              type: 'string',
              maxLength: 100,
              nullable: true
            },
            ip_address: {
              type: 'string',
              maxLength: 45,
              nullable: true
            },
            user_agent: {
              type: 'string',
              nullable: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Описание ошибки'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;

