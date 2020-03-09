const Product = require('../models/product');
const { transformResponse } = require('../lib/util');
const { errorHandler } = require('../lib/util');

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products.map(product => transformResponse(product)));
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
    const product = await Product.findById(id);
    res.json(transformResponse(product));
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.create = async (req, res, next) => {
  const {body} = req;
  try {
    const product = await Product.create({...body});
    res.json(transformResponse(product));
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
    const product = await Product.findOneAndUpdate({_id: id},
      {...body},
      {new: true});
    res.json(transformResponse(product));
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
    await Product.deleteMany({ _id: { $in: id } });
    res.end()
  } catch ({ message }) {
    return errorHandler({
      message
    }, next);
  }

};

const transformProduct = ({ _id: id, ...body }) =>
  ({
    id,
    ...body
  });
