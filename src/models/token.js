const mongoose = require('mongoose');
const {expiresIn} = require('../config');
const { Schema } = mongoose;

const TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true,
    required: true
  },
  token: {
    type: String,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt'
  },
  versionKey: false,
  expireAfterSeconds: expiresIn / 2
});

const user = mongoose.model('token', TokenSchema);

module.exports = user;
