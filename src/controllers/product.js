const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../lib/util');

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.find({});
    await res.json(products.map(product => product.toJSON()));
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

// exports.productsByQuery = async (req, res, next) => {
//   let query = null;
//   for(let key of req.query) {
//     query = {
//       ...query,
//       [key]: {$in: req.query[key]}
//     }
//   }
//   try {
//     const products = await Product.find(query);
//     await res.json(products.map(product => product.toJSON()));
//   } catch ({message}) {
//     errorHandler({
//       message,
//       statusCode: 401
//     }, next);
//   }
// };

exports.productsByCategoryId = async (req, res, next) => {
  const {categoryId} = req.params;
  try {
    const products = await Product.find({categoryId: {$in: categoryId}});
    await res.json(products.map(product => product.toJSON()));
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
    const product = await Product.findOne({ categoryId: id });
    await res.json(product.toJSON());
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
    await res.json(product.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.update = async (req, res, next) => {
  const { body: { id, ...body }, files: photo } = req;
  try {
    const product = await Product.findById(id);
    if (product) {
      for (const image of product.imagesPath) {
        if (image !== '/assets/uploads/unnamed.jpg') {
          await fs.unlinkSync(`.${image.replace(/assets/, 'src')}`);
        }
      }
    }
    const result = await Product.findById(id)
      .exec();
    result.name = body.name;
    result.description = body.description;
    result.status = body.status;
    result.price = body.price;
    result.imagesPath = photo.map(file => `/assets/uploads/${file.filename}`);
    result.deductFromStock = body.deductFromStock;
    result.manufactureId = body.manufactureId;
    result.categoryId = body.categoryId;
    result.recommendedProductIdList = body.recommendedProductIdList;

    await res.json(result.toJSON());
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
    const products = await Product.find({ productId: { $in: id } });
    for (let i = 0, length = products.length; i < length; i++) {
      if (products[i]) {
        for (const image of products[i].imagesPath) {
          if (image !== '/assets/uploads/unnamed.jpg') {
            await fs.unlinkSync(`.${image.replace(/assets/, 'src')}`);
          }
        }
      }
    }
    await Product.deleteMany({ productId: { $in: id } });
    res.end();
  } catch ({ message }) {
    return errorHandler({
      message
    }, next);
  }
};
