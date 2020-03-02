const Options = require('../../models/option');
const { errorHandler } = require('../../lib/util');

exports.getAll = (req, res, next) => {
  Options.find({})
    .then(options => res.json(options.map(option => transformOption(option))))
    .catch(({ message }) => errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.getById = (req, res, next) => {
  const { id: _id } = req.params;
  Options.findOne({ _id })
    .then(option => res.json(transformOption(option)))
    .catch(({ message }) => errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.create = (req, res, next) => {
  const { name, optionType, optionValues } = req.body;

  Options.create({
    name,
    optionType,
    optionValues
  }, (err, option) => {
    if (err) {
      return errorHandler({
        message: err
      }, next);
    }
    res.json(transformOption(option));
  });
};

exports.update = (req, res, next) => {
  const { id, name, optionType, optionValues } = req.body;
  Options.findOne({ _id: id }, (err, option) => {
    if (err) {
      return errorHandler({
        message: err
      }, next);
    }
    option.name = name;
    option.optionType = optionType;
    option.optionValues = optionValues;
    option
      .save()
      .then(opt => res.json(transformOption(opt)))
      .catch(({ message }) => errorHandler({
        message,
        statusCode: 404
      }, next));
  });
};

exports.delete = (req, res, next) => {
  const { id: _id } = req.params;

  Options.deleteOne({ _id }, err => {
    if (err) {
      return errorHandler({
        message: err
      }, next);
    }
    res.json({ message: 'ok' });
  });
};

const transformOption = ({ _id: id, name, optionType, optionValues }) => ({
  id,
  name,
  optionType,
  optionValues: optionValues.map(({_id, name}) => ({id: _id, name}))
});
