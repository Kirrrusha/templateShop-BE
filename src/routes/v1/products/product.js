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

async function checkExist(req, res, next) {
  console.log('req', req.body);
  if (req.method === 'POST') {
    try {
      const product = await Product.findOne({ name: req.body.name })
        .exec();
      console.log('product fileFilter POST', product);
      if (!!product) {
        return errorHandler({
          message: 'Product already exist',
          statusCode: 401
        }, next);
      }
      else {
        return next();
      }
    } catch ({ message }) {
      return errorHandler({
        message,
        statusCode: 401
      }, next);
    }
  }
  else if (req.method === 'PUT') {
    try {
      console.log('body', req.body);
      const product = await Product.findById(req.body.id)
        .exec();
      console.log('product fileFilter PUT', product);
      if (!product) {
        return errorHandler({
          message: 'Product not found',
          statusCode: 401
        }, next);
      }
      else {
        return next();
      }
    } catch (e) {
      return errorHandler({
        message,
        statusCode: 401
      }, next);
    }
  }
}

const isExistProduct = async (req, cb) => {
  try {
    console.log('method', req.method);
    if (req.method === 'POST') {
      const product = await Product.findOne({ name: req.body.name })
        .exec();
      console.log('product fileFilter POST', product);
      if (!!product) {
        return cb(new Error('Product already exist'), false);
      }
      else {
        return cb(null, true);
      }
    } else if (req.method === 'PUT') {
      const product = await Product.findById(req.body.id)
        .exec();
      console.log('product fileFilter PUT', product);
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
    console.log('file', file);
    // if (req.method === 'POST') {
    //   try {
    //     const product = await Product.findOne({ name: req.body.name })
    //       .exec();
    //     console.log('product fileFilter POST', product);
    //     if (!isEmpty(product)) {
    //       cb(new Error('Product already exist'), false);
    //     }
    //     else {
    //       cb(null, Date.now() + path.extname(file.originalname));
    //     }
    //   } catch (e) {
    //     cb(null, false, new Error(e));
    //   }
    // }
    // else if (req.method === 'PUT') {
    //   const product = await Product.findById(req.body.id)
    //     .exec();
    //   console.log('product fileFilter PUT', product);
    //   if (!product) {
    //     cb(new Error('Product not found'), false);
    //   } else {
    //     cb(null, Date.now() + path.extname(file.originalname));
    //   }
    // }
    // cb(null, Date.now() + path.extname(file.originalname));
    cb(null, file.originalname);
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
  // validate(ordersValidator),
  ctrlProduct.create
);

router.put('/',
  upload.any(),
  // validate(ordersValidator),
  ctrlProduct.update
);

router.delete('', ctrlProduct.delete);

module.exports = router;
