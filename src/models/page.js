const mongoose = require('mongoose');
const validator  = require('validator');
const { Schema } = mongoose;
const ObjectId = require('mongoose').Types.ObjectId;

const pageSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name pages'],
    unique: true,
    trim: true,
    min: 2,
    maxlength: 20,
    validate: {
      validator: value => validator.isAlpha(value, 'en-US'),
      message: '{VALUE} Invalid value',
    }
  },
  widgets: [{
    type: Schema.Types.ObjectId,
    ref: 'widget',
    index: true,
    required: [true, 'Add widget'],
    validate: {
      validator: value => ObjectId.isValid(value),
      message: '{VALUE} Invalid value',
    }
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
