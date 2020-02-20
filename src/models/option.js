const mongoose = require('mongoose');

const { Schema } = mongoose;

const optionSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name option product'],
  },
  type: {
    type: String,
    enum: ['checkbox', 'radio', 'select'],
  },
  values: [optionValuesSchema]

}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    versionKey: false,
    collection: 'OptionProductCollection',
  },
});

const optionValuesSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name option value']
  }
});

const option = mongoose.model('groupAttribute', optionSchema);

module.exports = option;
