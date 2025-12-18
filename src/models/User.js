const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Email должен быть валидным'
      },
      notEmpty: {
        msg: 'Email обязателен для заполнения'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Пароль обязателен для заполнения'
      },
      len: {
        args: [6, 255],
        msg: 'Пароль должен содержать минимум 6 символов'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager'),
    defaultValue: 'admin',
    validate: {
      isIn: {
        args: [['admin', 'manager']],
        msg: 'Роль должна быть admin или manager'
      }
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});

module.exports = User;

