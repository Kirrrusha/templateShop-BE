const Widget = require('../models/widget');
const { errorHandler } = require('../lib/util');

exports.getAll = async (req, res, next) => {
  try {
    const widgets = await Widget.find({})
      .populate({
        path: 'products',
        select: 'id name productId',
        match: { status: { $eq: true } }
      });
    await res.json(widgets.map(widget => widget.toJSON()));
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
    const module = await Widget.findById(id)
      .populate({
        path: 'products',
        select: 'id name productId',
        match: { status: { $eq: true } }
      });
    await res.json(module.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.create = async (req, res, next) => {
  const { name, status, products } = req.body;
  try {
    const widget = await Widget.create({
      name,
      status,
      products: typeof products === 'string' ? products.split(', ') : products
    });
    await res.json(widget.toJSON());
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
    const products = typeof body.products === 'string' ? body.products.split(', ') : body.products;
    const widget = await Widget.findById(id)
      .exec();
    widget.name = body.name || widget.name;
    widget.products = products.length ? products : widget.products;
    widget.status = !!body.status;
    await widget.save();
    await res.json(widget.toJSON());
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
    await Widget.deleteMany({ _id: { $in: id } });
    res.end();
  } catch ({ message }) {
    return errorHandler({
      message
    }, next);
  }
};
