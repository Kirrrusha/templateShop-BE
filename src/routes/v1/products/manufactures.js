const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlManufacturers = require('../../../controllers/product/manufactures');
const { validate } = require('../../../middleware');
const multer = require('multer');
const path = require('path');
const Manufacturers = require('../../../models/manufacturer');
const { isEmpty } = require('lodash');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png') {
      return cb(null, false, new Error('I don\'t have a clue!'));
    }
    Manufacturers.findOne({ name: req.body.name }, (err, manufacturer) => {
      if (err) {
        cb(null, false, new Error(err));
      }
      if (!isEmpty(manufacturer)) {
        cb(new Error('Manufacture already exist'), false);
      }
    });
    cb(null, true);
  }
});


const ordersValidator = [
  check('name')
    .isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('некорректный тип поля'),
  check('img')
    .isAlpha('en-US')
    .withMessage('некорректный тип поля')
];

router.get('/', ctrlManufacturers.getAll);

router.get('/:id', ctrlManufacturers.getById);

router.post('/', validate(ordersValidator), upload.single('img'), ctrlManufacturers.create);

router.put('/', validate(ordersValidator), upload.single('img'), ctrlManufacturers.update);

router.delete('', ctrlManufacturers.delete);

module.exports = router;
