const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const ctrlProduct = require('../../../controllers/product');
const { check } = require('express-validator');
const { validate } = require('../../../middleware');


const ordersValidator = [
  check('name').not().isEmpty()
    .withMessage('Obligatory field')
    .isLength({max: 15, min: 2})
    .withMessage('Wrong length name')
    .custom(value => {
      if (!validator.isAlphanumeric(value, 'en-US')
        && !validator.isAlphanumeric(value, 'ru-RU')) {
        throw new Error('Wrong type');
      }
      return true;
    }),
  check('description').optional()
    .isLength({max: 1000})
    .withMessage('Too much long'),
  check('status').optional()
    .isBoolean()
    .withMessage('Wrong type'),
  check('deductFromStock').optional()
    .isBoolean()
    .withMessage('Wrong type'),
  check('manufactureId').optional()
    .isNumeric().withMessage('Wrong type')
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

// router.get('/search', ctrlProduct.productsByQuery);
router.get('/byCategory/:categoryId', ctrlProduct.productsByCategoryId);

router.get('/:id', ctrlProduct.getById);

router.post('/',
  upload.array('photos', 12),
  ctrlProduct.create
);

router.put('/',
  upload.array('photos', 12),
  ctrlProduct.update
);

router.delete('', ctrlProduct.delete);

module.exports = router;
