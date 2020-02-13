const db = require('./src/initializers/db');
const app = require('./src/initializers/server').app;
const logger = require('./src/lib/logger');
const https = require('https');
const fs = require('fs');
const config = require('./src/config');

// connect to db
// db.connect();

// run server
// server.run();
https.createServer({
  key: fs.readFileSync('server.key', 'utf8'),
  cert: fs.readFileSync('server.cert', 'utf8')
}, app).listen(config.port, () => {
  console.log('\x1b[33m%s\x1b[0m', `Started on port ${config.port}`);
});

// catch unhandled exceptions
// process
//   .on('unhandledRejection', (reason) => {
//     logger.error(reason);
//   })
//   .on('uncaughtException', (err) => {
//     // logger.error(err);
//     process.exit(1);
//   });

// module.exports = server.app;
