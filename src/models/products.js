const mongoose = require('mongoose');

const { Schema } = mongoose;

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
  groupClientId: String,
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

const productsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name product'],
  },
  description: String,
  status: Boolean,
  price: {
    type: Number,
    required: [true, 'Add product\'s price'],
  },
  images: {
    type: [String],
    required: [true, 'Need at least one photo'],
  },
  deductFromStock: {
    type: Boolean,
    default: true
  },
  manufactureId: String,
  categoryId: [String],
  recommended: [String],
  attributes: [attributesProductSchema],
  options: [optionsProductSchema],
  discount: [discountProductSchema],
  stock: [stockProductSchema]
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    versionKey: false,
    collection: 'productsCollection',
  },
});

const products = mongoose.model('products', productsSchema);

module.exports = products;
