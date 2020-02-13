const http = require('http');
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const finalhandler = require('finalhandler');
const swaggerUi = require('swagger-ui-express');
const routes = require('../routes');
const config = require('../config');
const logger = require('../lib/logger');
const swaggerConfig = require('../swagger');
const passportConfig = require('../config/passport');

const app = express();

function run() {
  app.listen(config.port, () => {
    console.log('\x1b[33m%s\x1b[0m', `Started on port ${config.port}`);
  });
}

module.exports = {
  app, run,
};
