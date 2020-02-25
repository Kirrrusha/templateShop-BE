const mongoose = require('mongoose');

const { Schema } = mongoose;


const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Enter login'],
  },
  email: {
    type: String,
    required: [true, 'Enter email'],
  },
  password: {
    type: String,
    required: [true, 'Enter password'],
  },
  surname: String,
  name: String,
  middleName: String,
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    versionKey: false,
    collection: 'UsersCollection',
  },
});

const users = mongoose.model('users', UserSchema);

module.exports = users;
