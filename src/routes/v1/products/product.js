const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const ctrlProduct = require('../../../controllers/product');
const Product = require('../../../models/product');
const { isEmpty } = require('lodash');
const { check } = require('express-validator');
const { validate } = require('../../../middleware');
const { errorHandler } = require('../../../lib/util');


const ordersValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Obligatory field')
    .isLength({
      max: 15,
      min: 2
    })
    .withMessage('Wrong length name')
    .trim()
    .escape()
    .isAlphanumeric('en-US')
    .withMessage('Wrong symbol'),
  check('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Too much long')
    .trim()
    .escape(),
  check('status')
    .optional()
    .isBoolean()
    .withMessage('Wrong type'),
  check('deductFromStock')
    .optional()
    .isBoolean()
    .withMessage('Wrong type')
];

const isExistProduct = async (req, cb) => {
  try {
    if (req.method === 'POST') {
      const product = await Product.findOne({ name: req.body.name })
        .exec();
      if (!!product) {
        return cb(new Error('Product already exist'), false);
      }
      else {
        return cb(null, true);
      }
    } else if (req.method === 'PUT') {
      const product = await Product.findById(req.body.id)
        .exec();
      if (!product) {
        return cb(new Error('Product not found'), false);
      }
      else {
        return cb(null, true);
      }
    } else {
      return cb(null, true);
    }

  } catch (e) {
    cb(new Error(e), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), '/src/uploads/'));
  },
  filename: async (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: async (req, file, cb) => {
    if (file.length > 12) {
      cb(new Error('Too many files'), false);
    }
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      await isExistProduct(req, cb);
    }
    else {
      cb(new Error('File format should be PNG,JPG,JPEG'), false);
    }
  }
});

router.get('/', ctrlProduct.getAll);

// router.get('/search', ctrlProduct.productsByQuery);
router.get('/byCategory/:id', ctrlProduct.productsByCategoryId);

router.get('/:id', ctrlProduct.getById);

router.post('/',
  upload.any(),
  validate(ordersValidator),
  ctrlProduct.create
);

router.put('/',
  upload.any(),
  validate(ordersValidator),
  ctrlProduct.update
);

router.delete('', ctrlProduct.delete);

module.exports = router;
