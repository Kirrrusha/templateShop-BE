const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name category'],
    unique: true,
    trim: true,
    min: 2,
    maxlength: 15,
  },
  description: {
    type: String,
    maxlength: 50,
    trim: true
  },
  status: Boolean
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false
});

const category = mongoose.model('category', categorySchema);

module.exports = category;
