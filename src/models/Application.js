const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Имя обязательно для заполнения'
      },
      len: {
        args: [2, 100],
        msg: 'Имя должно содержать от 2 до 100 символов'
      }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Телефон обязателен для заполнения'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Email должен быть валидным'
      }
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Комментарий не должен превышать 1000 символов'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('new', 'in_progress', 'completed', 'rejected'),
    defaultValue: 'new',
    validate: {
      isIn: {
        args: [['new', 'in_progress', 'completed', 'rejected']],
        msg: 'Статус должен быть: new, in_progress, completed или rejected'
      }
    }
  },
  utm_source: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  utm_medium: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  utm_campaign: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'applications',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Application;

