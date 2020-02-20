const mongoose = require('mongoose');

const { Schema } = mongoose;

const GroupAttributeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name group attribute'],
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    versionKey: false,
    collection: 'GroupAttributeCollection',
  },
});

const groupAttribute = mongoose.model('groupAttribute', GroupAttributeSchema);

module.exports = groupAttribute;
