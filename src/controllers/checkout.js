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
  const { body: { id, ...body } } = req;
  try {
    const checkout = await Checkout.findById(id)
      .exec();
    checkout.name = body.name || checkout.name;
    checkout.surname = body.surname || checkout.surname;
    checkout.phone = body.phone || checkout.phone;
    checkout.email = body.email || checkout.email;
    checkout.checkout = body.checkout || checkout.checkout;
    await checkout.save();
    await res.json(checkout.toJSON());
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
    await Checkout.deleteMany({ _id: { $in: id } });
    //TODO send email, after delete
    res.end();
  } catch ({ message }) {
    return errorHandler({
      message
    }, next);
  }
};
