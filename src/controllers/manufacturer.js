const fs = require('fs');
const Manufacturer = require('../models/manufacturer');
const { errorHandler } = require('../lib/util');

exports.getAll = async (req, res, next) => {
  try {
    const manufacturers = await Manufacturer.find({});
    await res.json(manufacturers.map(manufacturer => manufacturer.toJSON()));
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
    const manufacturer = await Manufacturer.findById(id);
    await res.json(manufacturer.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 404
    }, next);
  }
};

exports.create = async (req, res, next) => {
  const { body: { name }, file } = req;
  console.log('file', file)
  try {
    const manufacturer = await Manufacturer.create({
      name,
      imagePath: file ? `/assets/uploads/${file.filename}` : '/assets/uploads/unnamed.jpg'
    });
    await res.json(manufacturer.toJSON());
  } catch ({ message }) {
    errorHandler({
      message
    }, next);
  }
};

exports.update = async (req, res, next) => {
  const { body: { id, ...body }, file } = req;
  try {
    const manufacturer = await Manufacturer.findById(id)
      .exec();
    console.log('manufacturer', manufacturer)
    if (manufacturer.imagePath && manufacturer.imagePath !== '/assets/uploads/unnamed.jpg' &&
      fs.existsSync(manufacturer.imagePath.replace(/assets/, 'src'))) {
      await fs.unlinkSync(`./${manufacturer.imagePath.replace(/assets/, 'src')}`);
    }
    manufacturer.name = body.name || manufacturer.name;
    manufacturer.imagePath = file ? `/assets/uploads/${file.filename}` : manufacturer.imagePath;
    await manufacturer.save();
    await res.json(manufacturer.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 404
    }, next);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.query;
  try {
    const manufactures = await Manufacturer.find({ _id: { $in: id } });
    for (let i = 0, length = manufactures.length; i < length; i++) {
      if (manufactures[i]) {
        if (manufactures[i].imagePath &&
          manufactures[i].imagePath !== '/assets/uploads/unnamed.jpg' &&
          fs.existsSync(manufactures[i].imagePath.replace(/assets/, 'src'))) {
          await fs.unlinkSync(`.${manufactures[i].imagePath.replace(/assets/, 'src')}`);
        }
      }
    }
    await Manufacturer.deleteMany({ _id: { $in: id } });
    await res.end();
  } catch ({ message }) {
    errorHandler({
      message
    }, next);
  }
};
