const mongoose = require('mongoose');

const { Schema } = mongoose;

const articlesSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name article'],
  },
  text: String,
  status: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false,
  collection: 'articlesCollection'
});

const modules = mongoose.model('modules', articlesSchema);

module.exports = modules;
