const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

morgan.token('err', ({err}) => err);

const devLogger = morgan('dev');

const errorLogger = morgan(':remote-addr :remote-user :method :url :status :response-time ms - :res[content-length] :err', {
  stream: fs.createWriteStream(path.join(__dirname, '../../error.log'), { flags: 'a' }),
  skip: function (req, res) { return res.statusCode < 400 }
});


module.exports = {devLogger, errorLogger};
