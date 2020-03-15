const Category = require('../models/category');
const { errorHandler } = require('../lib/util');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json(categories.map(category => transformCategory(category)));
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const category = await Category.findOne({ _id: id });
    res.json(transformCategory(category));
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.create = async (req, res, next) => {
  const { name, status, description } = req.body;
  try {
    const category = await Category.create({
      name,
      status,
      description
    });
    res.json(transformCategory(category));
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.update = async (req, res, next) => {
  const { id, name, text, status } = req.body;
  try {
    const category = await Category.findOneAndUpdate({_id: id} , {
      name, text,
      status
    }, {new: true});
    res.json(transformCategory(category));
  } catch ({ message }) {
    return errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.query;
  try {
    await Category.deleteMany({ _id: { $in: id } });
    res.end()
  } catch ({ message }) {
    return errorHandler({
      message
    }, next);
  }
};

const transformCategory = ({ _id: id, name, status, description }) =>
  ({
    id,
    name,
    status,
    description
  });
