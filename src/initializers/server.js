const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const passport = require('passport');
const cors = require('cors');
const { port, corsHeaders, bodyLimit } = require('../config');
const routes = require('../routes');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('../swagger');
const passportConfig = require('../config/passport');
const logger = require('../lib/logger');
const RateLimit = require('express-rate-limit');
const helmet = require('helmet');


const app = express();

app.use(helmet());

app.use('/assets/uploads/', express.static('src/uploads'));


// HTTP request logger
if (process.env.NODE_ENV !== 'production') {
  app.use(logger.devLogger);
}

app.use(logger.errorLogger);

passportConfig(passport);

app.use(cors({
  exposedHeaders: corsHeaders
}));

app.use(bodyParser.json({
  limit: bodyLimit
}));

// app.use(bodyParser.urlencoded({ extended: true }));

// swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.use(compression());


const apiLimiter = new RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/api', apiLimiter, routes);

app.use((err, req, res, next) => {
  if (err) {
    if (!err.statusCode) err.statusCode = 500;
    req.err = err.stack;
    console.error(err);
    return res.status(err.statusCode).send({message: err.message});
  }

  next();
});

function run() {
  app.listen(port, () => {
    console.log('\x1b[33m%s\x1b[0m', `Started on port ${port}`);
  });
}

module.exports = {
  app,
  run
};
