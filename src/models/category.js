const mongoose = require('mongoose');
const { useTag } = require('../lib/util');
const { validatorIsAlphanumeric } = require('../lib/util');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;


const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name category'],
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
  categoryId: {
    type: Number,
    unique: true,
    default: 0
  },
  description: {
    type: String,
    maxlength: 50,
    trim: true,
    set: useTag
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      const {_id, name, status, description, categoryId, updatedAt} = ret;
      return {
        id: _id,
        categoryId,
        name,
        description,
        status,
        updatedAt
      }
    }
  }
});

categorySchema.plugin(AutoIncrement, {inc_field: 'categoryId'});
categorySchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.'
});

const category = mongoose.model('category', categorySchema);

module.exports = category;
