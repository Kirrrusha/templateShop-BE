const mongoose = require('mongoose');
const { validatorIsAlphanumeric } = require('../lib/util');
const { Schema } = mongoose;

const pageSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name pages'],
    unique: true,
    trim: true,
    min: 2,
    maxlength: 20,
    validate: {
      validator: value => !validator.isAlphanumericLocales(value, 'en-US'),
      message: '{VALUE} Invalid value',
    }
  },
  widgets: [{
    type: Schema.Types.ObjectId,
    ref: 'widget',
    index: true,
    required: [true, 'Add widget']
  }],
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
      const {_id, name, status, widgets, updatedAt} = ret;
      return {
        id: _id,
        name,
        widgets,
        status,
        updatedAt
      }
    }
  }
});

const page = mongoose.model('page', pageSchema);

module.exports = page;
