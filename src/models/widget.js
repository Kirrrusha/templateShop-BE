const mongoose = require('mongoose');
const { validatorIsAlphanumeric } = require('../lib/util');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const { Schema } = mongoose;


const widgetSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name widget'],
    unique: true,
    trim: true,
    min: 2,
    maxlength: 20,
    validate: {
      validator: validatorIsAlphanumeric,
      message: '{VALUE} Invalid value',
    }
  },
  widgetId: {
    type: Number,
    unique: true,
    default: 0
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'product',
    index: true,
    required: [true, 'Add product']
  }],
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      console.log('ret', ret)
      const {_id, name, status, products, widgetId, updatedAt} = ret;
      return {
        id: _id,
        widgetId,
        name,
        products,
        status,
        updatedAt
      }
    }
  }
});

widgetSchema.plugin(AutoIncrement, {inc_field: 'widgetId'});

const widget = mongoose.model('widget', widgetSchema);

module.exports = widget;
