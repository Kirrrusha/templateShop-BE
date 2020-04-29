const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlManufacturers = require('../../../controllers/manufacturer');
const { validate } = require('../../../middleware');
const multer = require('multer');
const path = require('path');
const Manufacturer = require('../../../models/manufacturer');

const ordersValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Obligatory field')
    .isLength({
      max: 15,
      min: 2
    })
    .withMessage('Wrong length')
    .trim().escape(),
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), '/src/uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  }
});

const isExistManufacturer = async (req, cb) => {
  try {
    if (req.method === 'POST') {
      const manufacturer = await Manufacturer.findOne({ name: req.body.name })
        .exec();
      if (!!manufacturer) {
        return cb(new Error('Manufacturer already exist'), false);
      } else {
        return cb(null, true);
      }
    } else if (req.method === 'PUT') {
      const manufacturer = await Manufacturer.findById(req.body.id)
        .exec();
      if (!manufacturer) {
        return cb(new Error('Manufacturer not found'), false);
      } else {
        return cb(null, true);
      }
    } else {
      return cb(null, true);
    }

  } catch (e) {
    cb(new Error(e), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: async (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      await isExistManufacturer(req, cb);
    } else {
      cb(new Error("File format should be PNG,JPG,JPEG"), false);
    }
    cb(null, true);
  }
});

router.get('/', ctrlManufacturers.getAll);

router.get('/:id', ctrlManufacturers.getById);

router.post('/', upload.single('img'), validate(ordersValidator), ctrlManufacturers.create);

router.put('/', upload.single('img'), ctrlManufacturers.update);

router.delete('', ctrlManufacturers.delete);

module.exports = router;
