const mongoose = require('mongoose');

const { Schema } = mongoose;

const optionValuesSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name product value']
  }
});

const optionSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name product product'],
  },
  optionType: {
    type: String,
    enum: ['checkbox', 'radio', 'select'],
  },
  optionValues: [optionValuesSchema]
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    versionKey: false,
    collection: 'OptionProductCollection',
  },
});

const option = mongoose.model('optionProduct', optionSchema);

module.exports = option;
