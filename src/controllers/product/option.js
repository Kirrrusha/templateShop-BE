const Options = require('../../models/option');
const {errorHandler} = require('../../lib/util');

exports.getAll = (req, res, next) => {
  Options.find({})
    .then(options => res.json(options))
    .catch(({ message }) =>  errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.getById = (req, res, next) => {
  const {id} = req.query;
  Options.find({_id: id})
    .then(option => res.json(option))
    .catch(({ message }) => errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.create = (req, res, next) => {
  const {name, type, optionValues} = req.body;

  Options.create({name, type, optionValues}, (err, option) => {
    if (err) errorHandler({
      message: err
    }, next);
    res.json(option);
  });
};

exports.update = (req, res, next) => {
  const {id, name, type, optionValues} = req.body;
  Options.findOne({ id }, (err, option) => {
    if (err) errorHandler({
      message: err
    }, next);
    if (!option) errorHandler({
      message: 'Not found',
      statusCode: 404
    }, next);
    option.name = name;
    option.type = type;
    option.optionValues = optionValues;
    option
      .save()
      .then(opt => res.json(opt))
      .catch(({ message }) => errorHandler({
        message,
        statusCode: 404
      }, next));
  })
};

exports.delete = (req, res, next) => {
  const {id} = req.query;

  Options.deleteOne({ _id: id }, err => {
    if (err) errorHandler({
      message: err
    }, next);
    res.json({message: 'ok'});
  });
};
