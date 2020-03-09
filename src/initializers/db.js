const mongoose = require('mongoose');
const db = require('../config').mongoURI;

module.exports = {
  connect: async () => {
    try {
      await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
    } catch (e) {
      Error(e);
    }
  },
};
