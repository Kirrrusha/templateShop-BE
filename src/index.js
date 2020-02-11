const db = require('./initializers/db');
const server = require('./initializers/server');
const logger = require('./lib/logger');

// connect to db
db.connect();

// run server
server.run();

// catch unhandled exceptions
process
  .on('unhandledRejection', (reason) => {
    logger.error(reason);
  })
  .on('uncaughtException', (err) => {
    logger.error(err);
    process.exit(1);
  });

module.exports = server.app;
