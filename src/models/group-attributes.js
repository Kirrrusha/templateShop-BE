const mongoose = require('mongoose');

const { Schema } = mongoose;

const GroupAttributesSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name group attribute']
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false,
  collection: 'GroupAttributeCollection'
});

const groupAttributes = mongoose.model('groupAttributes', GroupAttributesSchema);

module.exports = groupAttributes;
