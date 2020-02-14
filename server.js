const db = require('./src/initializers/db');
const server = require('./src/initializers/server');

// connect to db
db.connect();

// run server
server.run();
