const fs = require('fs');
const Manufacturers = require('../../models/manufacturer');
const { errorHandler } = require('../../lib/util');


exports.getAll = (req, res, next) => {
  Manufacturers.find({})
    .then(manufacturers => res.json(manufacturers.map(manufacturer =>
      transformManufacturer(manufacturer))))
    .catch(({ message }) => errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.getById = (req, res, next) => {
  const { id: _id } = req.params;
  Manufacturers.findOne({ _id })
    .then(manufacturer => res.json(transformManufacturer(manufacturer)))
    .catch(({ message }) => errorHandler({
      message,
      statusCode: 404
    }, next));
};

exports.create = (req, res, next) => {
  const { name } = req.body;
  const {filename} = req.file;
  Manufacturers.create({name, img: `/assets/uploads/${filename}`}, (err, manufacturer) => {
    if (err) {
      return errorHandler({
        message: err
      }, next);
    }
    res.json(transformManufacturer(manufacturer));
  });
};

exports.update = (req, res, next) => {
  const { id: _id, name, img } = req.body;
  Manufacturers.findOne({ _id }, (err, manufacturer) => {
    if (err) {
      return errorHandler({
        message: err
      }, next);
    }
    manufacturer.name = name;
    manufacturer.img = img;
    manufacturer
      .save()
      .then(mnf => res.json(transformManufacturer(mnf)))
      .catch(({ message }) => errorHandler({
        message,
        statusCode: 404
      }, next));
  });
};

exports.delete = (req, res, next) => {
  const { id } = req.query;
  Manufacturers.deleteMany({
      _id: {
        $in: id
      }
    },
    err => {
      if (err) {
        return errorHandler({
          message: err
        }, next);
      }
      res.json({ message: 'ok' });
    });
};

const transformManufacturer = ({ _id: id, name, img }) =>
  ({
    id,
    name,
    img
  });
