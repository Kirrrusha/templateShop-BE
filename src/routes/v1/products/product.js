const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { check } = require('express-validator');
const ctrlProduct = require('../../../controllers/product');
const { validate } = require('../../../middleware');

const ordersValidator = [
  check('name').isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('Неверный тип данных')
    .isLength({max: 15, min: 2})
    .withMessage('Некорректная длина названия'),
  check('description')
    .isLength({max: 1000})
    .withMessage('Слишком длинное описание'),
  check('status').isBoolean()
    .withMessage('Неверный тип данных'),
  check('deductFromStock').isBoolean()
    .withMessage('Неверный тип данных'),
  check('manufactureId').isMongoId()
    .withMessage('Неверный тип данных'),
  check('categoryId').isMongoId()
    .withMessage('Неверный тип данных'),
  check('recommendedProductIdList').isMongoId()
    .withMessage('Неверный тип данных')
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("File format should be PNG,JPG,JPEG"), false);
    }
  }
});

router.get('/', ctrlProduct.getAll);

router.get('/:id', ctrlProduct.getById);

router.post('/', validate(ordersValidator), upload.array('photos', 12), ctrlProduct.create);

router.put('/', validate(ordersValidator), upload.array('photos', 12), ctrlProduct.update);

router.delete('', ctrlProduct.delete);

module.exports = router;
