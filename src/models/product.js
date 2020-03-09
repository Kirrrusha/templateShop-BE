const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { autoIncremental } = require('../lib/util');

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
  // groupClientId: String,
  priority: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    required: [true, 'Add stock\'s price']
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

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name products']
  },
  productId: {
    type: Number,
    unique: true,
    default: 0
  },
  description: String,
  status: Boolean,
  price: {
    type: Number,
    required: [true, 'Add products\'s price']
  },
  imagesPath: {
    type: [String],
    required: [true, 'Need at least one photo']
  },
  deductFromStock: {
    type: Boolean,
    default: true
  },
  manufactureId: {
    type: Schema.Types.ObjectId,
    ref: 'manufacture',
    index: true
  },
  categoryId: [{
    type: Schema.Types.ObjectId,
    ref: 'category',
    index: true
  }],
  recommended: [{
    type: Schema.Types.ObjectId,
    ref: 'product',
    index: true
  }],
  // attributes: [attributesProductSchema],
  // options: [optionsProductSchema],
  // discount: [discountProductSchema],
  stock: [stockProductSchema]
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false
});

productSchema.pre('save', (next) => autoIncremental(productSchema, this, next));


const product = mongoose.model('product', productSchema);

module.exports = product;
