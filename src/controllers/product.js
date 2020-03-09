const fs = require('fs');
const Product = require('../models/product');
const { transformResponse } = require('../lib/util');
const { errorHandler } = require('../lib/util');
const { difference } = require('lodash');

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
  const { body, files } = req;
  try {
    const product = await Product.create({
      ...body,
      imagesPath: files.map(file => `/assets/uploads/${file.filename}`)
    });
    const {
      _id, name, productId, description, status, price, imagesPath,
      deductFromStock, manufactureId, categoryId, recommendedProductIdList
    } = product;
    res.json(transformResponse({
      _id,
      name,
      productId,
      description,
      status,
      price,
      imagesPath,
      deductFromStock,
      manufactureId,
      categoryId,
      recommendedProductIdList
    }));
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.update = async (req, res, next) => {
  console.log('body', req.body);
  const { body: { id, ...body }, files: photo } = req;
  try {
    const product = await Product.findById(id);
    if (product) {
      for (const image of product.imagesPath) {
        await fs.unlinkSync(`.${image.replace(/assets/, 'src')}`);
      }
    }
    const result = await Product.findOneAndUpdate({ _id: id },
      {
        ...body,
        imagesPath: photo.map(file => `/assets/uploads/${file.filename}`)
      },
      { new: true });
    const {
      _id, name, productId, description, status, price, imagesPath,
      deductFromStock, manufactureId, categoryId, recommendedProductIdList
    } = result;

    res.json(transformResponse({
      id: _id,
      name,
      productId,
      description,
      status,
      price,
      imagesPath,
      deductFromStock,
      manufactureId,
      categoryId,
      recommendedProductIdList
    }));
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
    const product = await Product.findById(id);
    if (product) {
      for (const image of product.imagesPath) {
        await fs.unlinkSync(`.${image.replace(/assets/, 'src')}`);
      }
    }
    await Product.deleteMany({ _id: { $in: id } });
    res.end();
  } catch ({ message }) {
    return errorHandler({
      message
    }, next);
  }
};
