const https = require('https');
const fs = require('fs');
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
// const finalhandler = require('finalhandler');
const swaggerUi = require('swagger-ui-express');
const routes = require('../routes');
const config = require('../config');
const logger = require('../lib/logger');
const swaggerConfig = require('../swagger');
const passportConfig = require('../config/passport');

const app = express();
// app.server = https.createServer({
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem'),
//   passphrase: 'TEST'
// }, app);

// HTTP request logger
// if (process.env.NODE_ENV !== 'production') {
//   app.use(logger.devLogger);
// }
//
// app.use(logger.errorLogger);
//
// passportConfig(passport);
//
// // 3rd party middleware
// app.use(cors({
//   exposedHeaders: config.corsHeaders,
// }));
//
// app.use(bodyParser.json({
//   limit: config.bodyLimit,
// }));
//
// // compression
// app.use(compression());
//
// // swagger
// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
//
// // api router
// app.use('/api', routes);
//
// app.use((err, req, res, next) => {
//   if (err) {
//     req.err = err.stack;
//     // finalhandler(req, res)(err);
//     console.error(err);
//     return;
//   }
//
//   next();
// });

app.use('/api/v1', (req, res) => res.send('hello world'))

// function run() {
//   // app.server.listen(config.port, () => {
//   //   console.log('\x1b[33m%s\x1b[0m', `Started on port ${app.server.address().port}`);
//   // });
//   https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, app).listen(config.port, () => {
//       console.log('\x1b[33m%s\x1b[0m', `Started on port ${config.port}`);
//   });
// }

module.exports = {
  app
};
