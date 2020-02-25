const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentsSchema = new Schema({
  authorName: {
    type: String,
    default: 'Anonymous'
  },
  authorId: String,
  text: {
    type: String,
    required: [true, 'Required field'],
  },
  rating: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    versionKey: false,
    collection: 'OptionProductCollection'
  }
});

const comments = mongoose.model('comments', commentsSchema);

module.exports = comments;
