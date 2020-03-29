const Attributes = require('../models/attribute');
const {errorHandler} = require('../lib/util');

exports.getAll = (req, res, next) => {
  Attributes.find({})
    .then(attributes => res.json(attributes.map(attribute => transformAttributes(attribute))))
    .catch(({ message }) =>  errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.getById = (req, res, next) => {
  const {id} = req.params;
  Attributes.findOne({_id: id})
    .then(attribute => res.json(transformAttributes(attribute)))
    .catch(({ message }) => errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.create = (req, res, next) => {
  const {name, groupId} = req.body;

  Attributes.create({name, groupId}, (err, attribute) => {
    if (err) return errorHandler({
      message: err
    }, next);
    res.json(transformAttributes(attribute));
  });
};

exports.update = (req, res, next) => {
  const {id, name} = req.body;
  Attributes.findOne({ _id: id }, (err, attributes) => {
    if (err) return errorHandler({
      message: err
    }, next);
    attributes.name = name;
    attributes
      .save()
      .then(atr => res.json(atr))
      .catch(({ message }) => errorHandler({
        message,
        statusCode: 404
      }, next));
  })
};

exports.delete = (req, res, next) => {
  const {id} = req.params;

  Attributes.deleteOne({ _id: id }, err => {
    if (err) return errorHandler({
      message: err
    }, next);
    res.json({message: 'ok'});
  });
};

const transformAttributes = ({_id, name, groupId}) => ({id: _id, name, groupId});
