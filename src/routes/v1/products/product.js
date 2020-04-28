const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const ctrlProduct = require('../../../controllers/product');
const Product = require('../../../models/product');
const { isEmpty } = require('lodash');
const { check } = require('express-validator');
const { validate } = require('../../../middleware');


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
    .escape(),
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


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(path.join(process.cwd(), '/src/uploads/'))
    cb(null, path.join(process.cwd(), '/src/uploads/'));
  },
  filename: async (req, file, cb) => {
    console.log('file', file);
    if (req.method === 'POST') {
      try {
        const product = await Product.findOne({ name: req.body.name }).exec();
        console.log('product fileFilter POST', product);
        if (!!product) {
          return cb(new Error('Product already exist'), false);
        }
        else {
          return cb(null, Date.now() + path.extname(file.originalname));
        }
      } catch (e) {
        return cb(null, false, new Error(e));
      }
    }
    else if (req.method === 'PUT') {
      try {
        const product = await Product.findById(req.body.id).exec();
        console.log('product fileFilter PUT', product);
        if (!product) {
          return cb(new Error('Product not found'), false);
        } else {
          return cb(null, Date.now() + path.extname(file.originalname));
        }
      } catch (e) {
        return cb(null, false, new Error(e));
      }
    }
    // cb(null, Date.now() + path.extname(file.originalname));
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
      cb(null, true);
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
