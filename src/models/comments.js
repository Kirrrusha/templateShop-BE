const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentsSchema = new Schema({
  productId: {
    type: String,
    required: true
  },
  authorId: String,
  text: {
    type: String,
    required: [true, 'Required field'],
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
  collection: 'CommentsCollection'
});

const comments = mongoose.model('comments', commentsSchema);

module.exports = comments;
