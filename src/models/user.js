const mongoose = require('mongoose');
const validator = require('validator');
const { validatorIsAlphanumeric } = require('../lib/util');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Enter login'],
    trim: true,
    minLength: 2,
    maxlength: 15,
    validate: {
      validator: (value) => validator.isAlphanumeric(value, 'en-US'),
      message: '{VALUE} Invalid value',
    }
  },
  email: {
    type: String,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: '{VALUE} Invalid email',
    },
    required: [true, 'Enter email']
  },
  password: {
    type: String,
    required: [true, 'Enter password']
  },
  surname: {
    type: String,
    trim: true,
    maxlength: 20,
    validate: {
      validator: validatorIsAlphanumeric,
      message: '{VALUE} Invalid value',
    }
  },
  name: {
    type: String,
    trim: true,
    maxlength: 20,
    validate: {
      validator: validatorIsAlphanumeric,
      message: '{VALUE} Invalid value',
    }
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: 20,
    validate: {
      validator: validatorIsAlphanumeric,
      message: '{VALUE} Invalid value',
    }
  },
  role: {
    type: String,
    default: 'basic',
    enum: ['basic', 'supervisor'],
    validate: {
      validator: async (value, respond) => {
        if (value === 'supervisor') {
          try {
            const admin = await user.findOne({ role: value });
            return !admin;
          } catch (e) {
            throw e.message;
          }
        }
      },
      message: 'admin exists'
    }
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      const {_id, username, surname, email, name, middleName, role} = ret;
      return {
        id: _id,
        username,
        email,
        name,
        surname,
        middleName,
        role
      }
    }
  }
});

const user = mongoose.model('user', UserSchema);

module.exports = user;
