const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const passport = require('passport');
const cors = require('cors');
const { port, corsHeaders, bodyLimit } = require('../config');
const routes = require('../routes');
const passportConfig = require('../config/passport');

const app = express();


app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

passportConfig(passport);

app.use(cors({
  exposedHeaders: corsHeaders
}));

app.use(bodyParser.json({
  limit: bodyLimit
}));

app.use(compression());

app.use('/api', routes);

function run() {
  app.listen(port, () => {
    console.log('\x1b[33m%s\x1b[0m', `Started on port ${port}`);
  });
}

module.exports = {
  app,
  run
};
