const validator = require('validator');
const HTMLParser = require('node-html-parser');

exports.toRes = function toRes(res, status = 200) {
  return (err, thing) => {
    if (err) {
      return res.status(500)
        .send(err);
    }

    if (thing && typeof thing.toObject === 'function') {
      thing = thing.toObject();
    }
    res.status(status)
      .json(thing);
  };
};

exports.asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

exports.errorHandler = ({ message, statusCode = 500 }, next) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return next(err);
};

exports.transformResponse = ({ _id: id, ...body }) => ({ id, ...body });

exports.validatorIsAlphanumeric = (value) =>
  !validator.isAlphanumeric(value, 'en-US')
  || !validator.isAlphanumeric(value, 'ru-RU');

exports.useTag = (value) => HTMLParser.parse(value, {
  lowerCaseTagName: false,
  script: false,
  style: false,
  pre: false,
  comment: false
});
