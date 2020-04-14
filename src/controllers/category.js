const Category = require('../models/category');
const { errorHandler } = require('../lib/util');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    await res.json(categories.map(category => category.toJSON()));
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
    const category = await Category.findById(id);
    await res.json(category.toJSON());
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
    await res.json(category.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.update = async (req, res, next) => {
  const { id, ...body } = req.body;
  try {
    const category = await Category.findById(id).exec();
    category.name = body.name || category.name;
    category.description = body.description || category.description;
    category.status = !!body.status;
    await category.save();
    await res.json(category.toJSON());
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
