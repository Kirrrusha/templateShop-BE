const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('../routes');
const config = require('../config');
const logger = require('../lib/logger');
const compression = require('compression');
const finalhandler = require('finalhandler');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('../swagger');

let app = express();
app.server = http.createServer(app);

// HTTP request logger
if (process.env.NODE_ENV !== 'production') {
  app.use(logger.devLogger);
}

app.use(logger.errorLogger);

// 3rd party middleware
app.use(cors({
  exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
  limit : config.bodyLimit
}));

// compression
app.use(compression());

// swagger
app.use('/bff/swagger', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// api router
app.use('/bff/api', routes());

app.use((err, req, res, next) => {
  if (err) {
    req.err = err.stack;
    finalhandler(req, res)(err);
    console.error(err);
    return;
  }

  next();
});

function run() {
  app.server.listen(config.port, () => {
    console.log('\x1b[33m%s\x1b[0m', `Started on port ${app.server.address().port}`);
  });
}

module.exports = {
  app, run
};
