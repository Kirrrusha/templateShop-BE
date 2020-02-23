const mongoose = require('mongoose');

const { Schema } = mongoose;

const categoriesSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name category'],
  },
  description: String,
  status: Boolean
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    versionKey: false,
    collection: 'categoriesCollection',
  },
});

const categories = mongoose.model('categories', categoriesSchema);

module.exports = categories;
