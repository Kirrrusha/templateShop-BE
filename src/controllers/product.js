const fs = require('fs');
const Product = require('../models/product');
const { errorHandler } = require('../lib/util');

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .populate({
        path: 'manufacturer',
        select: 'name imagePath'
      })
      .populate({
        path: 'category',
        select: 'name description status'
      })
      .populate('recommendedProductIdList')
      .populate({
        path: 'comments',
        select: 'text author rating visible',
        populate: {
          path: 'author',
          model: 'user'
        }
      })
      .exec();
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
  const { id } = req.params;
  try {
    const products = await Product.find({ category: { $in: id } })
      .populate({
        path: 'manufacturer',
        select: 'name imagePath'
      })
      .populate({
        path: 'category',
        select: 'name description status'
      })
      .populate('recommendedProductIdList')
      .populate({
        path: 'comments',
        select: 'text author rating visible',
        populate: {
          path: 'author',
          model: 'user'
        }
      })
      .exec();
    await res.json(products.map(product => product.toJSON()));
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

// exports.commentsByProductId = async (req, res, next) => {
//   const {categoryId} = req.params;
//   try {
//     const products = await Product.find({categoryId: {$in: categoryId}});
//     await res.json(products.map(product => product.toJSON()));
//   } catch ({ message }) {
//     errorHandler({
//       message,
//       statusCode: 401
//     }, next);
//   }
// };

exports.getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
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
    const product = await Product.findById(id).exec();
    if (product && photo.length) {
      for (const image of product.imagesPath) {
        if (image !== '/assets/uploads/unnamed.jpg' &&
          fs.existsSync(`.${image.replace(/assets/, 'src')}`)) {
          await fs.unlinkSync(`.${image.replace(/assets/, 'src')}`);
        }
      }
    }
    product.name = body.name || product.name;
    product.description = body.description || product.description;
    product.status = body.status || product.status;
    product.price = body.price || product.price;
    product.imagesPath = photo ?
      photo.map(file => `/assets/uploads/${file.filename}`) : product.imagesPath;
    product.deductFromStock = body.deductFromStock || product.deductFromStock;
    product.manufacturerId = body.manufacturerId || product.manufacturerId;
    product.category = body.category || product.category;
    product.manufacturer = body.manufacturer || product.manufacturer;
    product.recommendedProductIdList = body.recommendedProductIdList || product.recommendedProductIdList;
    product.comments = body.comments || product.comments;
    product.quantity = body.quantity || product.quantity;
    await product.save();
    await res.json(product.toJSON());
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
    const products = await Product.find({ _id: { $in: id } });
    for (let i = 0, length = products.length; i < length; i++) {
      if (products[i]) {
        for (const image of products[i].imagesPath) {
          if (image !== '/assets/uploads/unnamed.jpg' &&
            fs.existsSync(`.${image.replace(/assets/, 'src')}`)) {
            await fs.unlinkSync(`.${image.replace(/assets/, 'src')}`);
          }
        }
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
