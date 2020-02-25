const mongoose = require('mongoose');

const { Schema } = mongoose;

const attributeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name attribute'],
  },
  groupId: String
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false,
  collection: 'AttributeCollection',
});

const attribute = mongoose.model('attribute', attributeSchema);

module.exports = attribute;
