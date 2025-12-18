const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Middleware для проверки результатов валидации
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg
    }));
    
    return next(ApiError.badRequest('Ошибка валидации', formattedErrors));
  }
  
  next();
};

module.exports = validate;

