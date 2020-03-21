const mongoose = require('mongoose');
const { useTag } = require('../lib/util');
const { validatorIsAlphanumeric } = require('../lib/util');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;


const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name category'],
    unique: true,
    trim: true,
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
      const {_id, name, status, description, categoryId} = ret;
      return {
        id: _id,
        categoryId,
        name,
        description,
        status
      }
    }
  }
});

categorySchema.plugin(AutoIncrement, {inc_field: 'categoryId'});

const category = mongoose.model('category', categorySchema);

module.exports = category;
