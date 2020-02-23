const mongoose = require('mongoose');

const { Schema } = mongoose;

const modulesSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Add name modules'],
  },
  type: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    versionKey: false,
    collection: 'modulesCollection',
  },
});

const modules = mongoose.model('modules', modulesSchema);

module.exports = modules;
