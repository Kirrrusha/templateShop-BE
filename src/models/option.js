const mongoose = require('mongoose');

const { Schema } = mongoose;

const optionValuesSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name products value']
  }
});

const optionSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name products products'],
  },
  optionType: {
    type: String,
    enum: ['checkbox', 'radio', 'select'],
  },
  optionValues: [optionValuesSchema]
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  collection: 'OptionProductCollection',
  versionKey: false
});

const option = mongoose.model('optionProduct', optionSchema);

module.exports = option;
