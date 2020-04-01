const mongoose = require('mongoose');
const isNumber = require('lodash');
const { validatorIsAlphanumeric } = require('../lib/util');
const { Schema } = mongoose;


const checkoutSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    index: true
  },
  name: {
    type: String,
    required: [true, 'Add name customer'],
    trim: true,
    min: 2,
    maxlength: 20,
    validate: {
      validator: validatorIsAlphanumeric,
      message: '{VALUE} Invalid value',
    }
  },
  surname: {
    type: String,
    trim: true,
    min: 2,
    maxlength: 20,
    validate: {
      validator: validatorIsAlphanumeric,
      message: '{VALUE} Invalid value',
    }
  },
  phone: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Required field'],
    trim: true,
    validate: {
      validator: (value) => isNumber(value),
      message: '{VALUE} Invalid value',
    },
  },
  total: {
    type: Number,
    required: [true, 'Required field'],
    trim: true,
    validate: {
      validator: (value) => isNumber(value),
      message: '{VALUE} Invalid value',
    },
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      const {_id, name, product, surname, phone} = ret;
      return {
        id: _id,
        product,
        name,
        surname,
        phone
      }
    }
  }
});

checkoutSchema.pre('save', (next) => {
  const
  next()
});

const checkout = mongoose.model('checkout', checkoutSchema);

module.exports = checkout;
