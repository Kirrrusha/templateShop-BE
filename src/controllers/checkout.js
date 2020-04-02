const fs = require('fs');
const Checkout = require('../models/checkout');

exports.getAll = async (req, res, next) => {
  try {
    const checkouts = await Checkout.find({})
      .populate({
        populate: {
          path: 'product'
        }
      })
      .exec();
    await res.json(checkouts.map(checkout => checkout.toJSON()));
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
    const checkout = await Checkout.findById(id);
    await res.json(checkout.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.create = async (req, res, next) => {
  const { body } = req;
  try {
    const checkout = await Checkout.create({ ...body });
    await res.json(checkout.toJSON());
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
    const product = await Product.findById(id)
      .exec();
    if (product) {
      for (const image of product.imagesPath) {
        if (image !== '/assets/uploads/unnamed.jpg') {
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
