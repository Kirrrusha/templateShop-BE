const mongoose = require('mongoose');

const { Schema } = mongoose;

const articlesSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name article'],
  },
  type: String,
  text: String,
  status: Boolean
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    versionKey: false,
    collection: 'modulesCollection',
  },
});

const modules = mongoose.model('modules', articlesSchema);

module.exports = modules;
