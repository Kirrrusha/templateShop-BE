const mongoose = require('mongoose');
const { validatorIsAlphanumeric } = require('../lib/util');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;

const manufacturerSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name manufacturer'],
    unique: true,
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
        imagePath
      }
    }
  }
});

manufacturerSchema.plugin(AutoIncrement, {inc_field: 'manufacturerId'});

const manufacturer = mongoose.model('manufacture', manufacturerSchema);

module.exports = manufacturer;
