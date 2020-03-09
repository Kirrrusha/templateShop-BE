const mongoose = require('mongoose');

const { Schema } = mongoose;

const manufacturersSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name manufacturer'],
  },
  img: {
    type: String,
    default: ''
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false,
});

const manufacturer = mongoose.model('manufacture', manufacturersSchema);

module.exports = manufacturer;
