const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
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
  newPrice: {
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
  description: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  status: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: [true, 'Add products\'s price']
  },
  imagesPath: {
    type: [String],
    default: ['/assets/uploads/unnamed.jpg']
  },
  // deductFromStock: {
  //   type: Boolean,
  //   default: false
  // },
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
  recommendedProductIdList: [{
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

productSchema.plugin(AutoIncrement, {inc_field: 'productId'});

const product = mongoose.model('product', productSchema);

module.exports = product;
