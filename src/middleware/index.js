const { validationResult } = require('express-validator');

exports.validate = (checks) => [
  ...checks,
  (req, res, next) => {
    const errors = validationResult(req.body);

    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array().map((err) => err.msg).join(' ') });
    }

    next();
  },
];
