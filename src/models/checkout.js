const mongoose = require('mongoose');
const { Schema } = mongoose;
const isNumber = require('lodash');
const Product = require('./product');
const { validatorIsAlphanumeric } = require('../lib/util');
const { errorHandler } = require('../lib/util');

const basketSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    index: true,
    required: [true, 'Add product']
  },
  quantity: {
    type: Number,
    required: [true, 'Required field'],
    trim: true,
    validate: {
      validator: (value) => isNumber(value),
      message: '{VALUE} Invalid value'
    }
  },
  total: {
    type: Number,
    required: [true, 'Required field'],
    trim: true,
    validate: {
      validator: (value) => isNumber(value),
      message: '{VALUE} Invalid value'
    }
  }
});

const checkoutSchema = new Schema({
  checkout: {
    type: [basketSchema],
    validator: {
      validator: value => value.length < 20,
      message: 'So many checkouts'
    }
  },
  name: {
    type: String,
    required: [true, 'Add name customer'],
    trim: true,
    min: 2,
    maxlength: 20,
    validate: {
      validator: validatorIsAlphanumeric,
      message: '{VALUE} Invalid value'
    }
  },
  surname: {
    type: String,
    trim: true,
    min: 2,
    maxlength: 20,
    validate: {
      validator: validatorIsAlphanumeric,
      message: '{VALUE} Invalid value'
    }
  },
  email: {
    type: String,
    trim: true,
    validate: {
      validator: value => !validator.isEmail(value),
      message: '{VALUE} is not email'
    }
  },
  phone: {
    type: String,
    trim: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      const { _id, name, products, surname, phone } = ret;
      return {
        id: _id,
        products,
        name,
        surname,
        phone
      };
    }
  }
});

checkoutSchema.pre('save', async (next) => {
  try {
    const productIdList = this.basket.map(item => item.product);
    const basketMap = this.basket.reduce((result, filter) => {
      result[filter.product] = filter.quantity;
      return result;
    }, {});
    const products = await Product.find({ _id: { $in: productIdList } })
      .exec();
    if (!products.deductFromStock) {
      next();
    }
    products.forEach(item => {
      if (+products.quantity < +this.quantity) {
        item.quantity = +item.quantity - +basketMap[item.id];
      } else {
        errorHandler({
          message: 'too little product',
          statusCode: 401
        }, next);
      }
      products.save();
    });
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
  next();
});

const checkout = mongoose.model('checkout', checkoutSchema);

module.exports = checkout;
