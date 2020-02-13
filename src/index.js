// const db = require('./initializers/db');
// const server = require('./initializers/server');
// const logger = require('./lib/logger');
// const express = require('express');
// connect to db
// db.connect();

// run server

// app.use('/api', );
// server.run();

const express = require('express');
const app = express();
// const path = require('path');
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({message: 'ok'})
});

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));

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
