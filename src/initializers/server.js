const express = require('express');
const {port} = require('../config');

const app = express();


app.get('/', (req, res) => {
  res.json({message: 'ok'})
});

function run() {
  app.listen(port, () => {
    console.log('\x1b[33m%s\x1b[0m', `Started on port ${port}`);
  });
}

module.exports = {
  app, run,
};
