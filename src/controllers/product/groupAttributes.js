const GroupAttributes = require('../../models/group-attributes');
const {errorHandler} = require('../../lib/util');

exports.getAll = (req, res, next) => {
  GroupAttributes.find({})
    .then(groupAttributes => res.json(groupAttributes.map(group => transformGroupAttributes(group))))
    .catch(({ message }) =>  errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.getById = (req, res, next) => {
  const {id} = req.params;
  GroupAttributes.findOne({_id: id})
    .then(groupAttributes => res.json(transformGroupAttributes(groupAttributes)))
    .catch(({ message }) => errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.create = (req, res, next) => {
  const {name} = req.body;

  GroupAttributes.create({name}, (err, groupAttributes) => {
    if (err) return errorHandler({
      message: err
    }, next);
    res.json(transformGroupAttributes(groupAttributes));
  });
};

exports.update = (req, res, next) => {
  const {id: _id, name} = req.body;
  GroupAttributes.findOne({ _id }, (err, groupAttributes) => {
    if (err) return errorHandler({
      message: err
    }, next);
    groupAttributes.name = name;
    groupAttributes
      .save()
      .then(opt => res.json(opt))
      .catch(({ message }) => errorHandler({
        message,
        statusCode: 404
      }, next));
  })
};

exports.delete = (req, res, next) => {
  const {id} = req.params;

  GroupAttributes.deleteOne({ _id: id }, err => {
    if (err) return errorHandler({
      message: err
    }, next);
    res.json({message: 'ok'});
  });
};

const transformGroupAttributes = ({_id, name}) => ({id: _id, name});
