const mongoose = require('mongoose');
const config = require('../config');

module.exports = {
  connect: () => async function () {
    try {
      const {mongoURI: db} = config;
      await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    } catch (e) {
      new Error(e)
    }
  }
};