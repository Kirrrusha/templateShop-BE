const { errorHandler } = require('../lib/util');
const { validationResult } = require('express-validator');

exports.validate = (checks) => [
  ...checks,
  (req, res, next) => {
  // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorHandler({
        message: errors.array().map((err) => {
          return `${err.param} - ${err.msg}`}).join('; '),
        statusCode: 401
      }, next)
    }

    next();
  },
];
