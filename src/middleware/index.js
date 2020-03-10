const { errorHandler } = require('../lib/util');
const { validationResult } = require('express-validator');

exports.validate = (checks) => [
  ...checks,
  (req, res, next) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      errorHandler({
        message: errors.array().map((err) => err.msg).join(' '),
        statusCode: 422
      }, next)
    }

    next();
  },
];
