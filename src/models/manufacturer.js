const mongoose = require('mongoose');
const { validatorIsAlphanumeric } = require('../lib/util');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;
const {host, protocol, port}  = require('../config');

const manufacturerSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name manufacturer'],
    unique: true,
    index: true,
    uniqueCaseInsensitive: true,
    trim: true,
    min: 2,
    maxlength: 15,
    validate: {
      validator: validatorIsAlphanumeric,
      message: '{VALUE} Invalid value',
    }
  },
  imagePath: {
    type: String,
    default: '/assets/uploads/unnamed.jpg'
  },
  manufacturerId: {
    type: Number,
    unique: true,
    default: 0
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      const {_id, name, imagePath, manufacturerId} = ret;
      return {
        id: _id,
        manufacturerId,
        name,
        imagePath: `${protocol}://${host}:${port}/assets/uploads/${imagePath}`
      }
    }
  }
});

manufacturerSchema.plugin(AutoIncrement, {inc_field: 'manufacturerId'});
manufacturerSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.'
});

const manufacturer = mongoose.model('manufacture', manufacturerSchema);

module.exports = manufacturer;
