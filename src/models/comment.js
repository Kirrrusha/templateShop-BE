const mongoose = require('mongoose');
const { validatorIsAlphanumeric } = require('../lib/util');
const { Schema } = mongoose;

const commentSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    index: true,
    required: [true, 'Required field']
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true,
    required: [true, 'Required field']
  },
  text: {
    type: String,
    required: [true, 'Required field'],
    trim: true,
    min: 2,
    maxlength: 300,
    validate: {
      validator: validatorIsAlphanumeric,
      message: '{VALUE} Invalid value'
    }
  },
  rating: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    min: 1,
    max: 5
  },
  visible: {
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
      const { _id, text, productId, authorId, rating, visible } = ret;
      return {
        id: _id,
        text,
        productId,
        authorId,
        rating,
        visible
      };
    }
  }
});

const comment = mongoose.model('comment', commentSchema);

module.exports = comment;
