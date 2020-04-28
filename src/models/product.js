const mongoose = require('mongoose');
const { validatorIsAlphanumeric } = require('../lib/util');
const uniqueValidator = require('mongoose-unique-validator');
const isNumber = require('lodash');
const { useTag } = require('../lib/util');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;
const {url}  = require('../config');

const attributesProductSchema = new Schema({
  attributeId: String,
  text: String
});

const optionsProductSchemaProductSchema = new Schema({
  optionValueId: String,
  amount: {
    type: Boolean,
    default: true
  },
  deductFromStock: {
    type: Boolean,
    default: true
  },
  sign: {
    type: Boolean,
    default: true
  },
  price: Number
});

const optionsProductSchema = new Schema({
  optionId: String,
  status: Boolean,
  optionValues: [optionsProductSchemaProductSchema]
});

const discountProductSchema = new Schema({
  groupClientId: String,
  amount: {
    type: Number,
    default: 10
  },
  priority: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: new Date()
  },
  endDate: {
    type: Date,
    default: new Date()
  }
});

const stockProductSchema = new Schema({
  // groupClientId: String,
  priority: {
    type: Number,
    default: 1,
    max: 20,
    trim: true,
    validate: {
      validator: (value) => isNumber(value),
      message: '{VALUE} Invalid value',
    }
  },
  newPrice: {
    type: Number,
    required: [true, 'Add stock\'s price'],
    max: 1000000,
    trim: true,
    validate: {
      validator: (value) => isNumber(value),
      message: '{VALUE} Invalid value',
    }
  },
  startDate: {
    type: Date,
    default: new Date(),
  },
  endDate: {
    type: Date,
    default: new Date()
  }
});

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name products'],
    unique: true,
    trim: true,
    index: true,
    uniqueCaseInsensitive: true,
    min: 2,
    maxlength: 15,
    validate: {
      validator: validatorIsAlphanumeric,
      message: '{VALUE} Invalid value',
    }
  },
  productId: {
    type: Number,
    unique: true,
    default: 0
  },
  description: {
    type: String,
    maxlength: 1000,
    trim: true,
    set: useTag
  },
  status: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: [true, 'Add products\'s price'],
    max: 1000000,
    trim: true,
    validate: {
      validator: (value) => isNumber(value),
      message: '{VALUE} Invalid value',
    }
  },
  quantity: {
    type: Number,
    trim: true,
    validate: {
      validator: (value) => isNumber(value),
      message: '{VALUE} Invalid value',
    },
    default: 100
  },
  imagesPath: {
    type: [String],
    default: ['/assets/uploads/unnamed.jpg'],
    validate: {
      validator: (value) => value.length <= 12,
      message: '{VALUE} exceeds the limit of 12',
    }
  },
  deductFromStock: {
    type: Boolean,
    default: false
  },
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: 'manufacture',
    index: true
  },
  category: [{
    type: Schema.Types.ObjectId,
    ref: 'category',
    index: true
  }],
  recommendedProductIdList: [{
    type: Schema.Types.ObjectId,
    ref: 'product',
    index: true
  }],
  // attributes: [attributesProductSchema],
  // options: [optionsProductSchema],
  // discount: [discountProductSchema],
  // stock: [stockProductSchema],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'comment',
    index: true
  }]
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      const {
        _id, name, productId, description, status,
        price, imagesPath, deductFromStock,
        manufacturer, category, recommendedProductIdList, comments,
        quantity, updatedAt
      } = ret;
      return {
        id: _id,
        name, productId, description, status,
        price,
        imagesPath: imagesPath.map(image => `${url}/assets/uploads/${image}`),
        deductFromStock,
        manufacturer, category, recommendedProductIdList, comments,
        quantity, updatedAt
      }
    }
  }
});

productSchema.pre('save', (next) => {
  if (this.deductFromStock) {
    this.quantity = this.quantity - 1;
  }
  next()
});

productSchema.plugin(AutoIncrement, {inc_field: 'productId'});
productSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.'
});

const product = mongoose.model('product', productSchema);

module.exports = product;
