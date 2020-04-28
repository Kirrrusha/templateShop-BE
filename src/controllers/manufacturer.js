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
    if (manufacturer.imagePath && manufacturer.imagePath !== 'unnamed.jpg' &&
      fs.existsSync(path.join(process.cwd(), `/src/uploads/${manufacturer.imagePath}`))) {
      await fs.unlinkSync(path.join(process.cwd(), `/src/uploads/${manufacturer.imagePath}`));
    }
    manufacturer.name = body.name || manufacturer.name;
    manufacturer.imagePath = file ? file.filename : manufacturer.imagePath;
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
          image !== 'unnamed.jpg' &&
          fs.existsSync(path.join(process.cwd(), `/src/uploads/${image}`))) {
          await fs.unlinkSync(path.join(process.cwd(), `/src/uploads/${image}`));
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
