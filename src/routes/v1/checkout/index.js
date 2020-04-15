const express = require('express');
const router = express.Router();
const validator = require('validator');
const { check } = require('express-validator');
const ctrlCheckout = require('../../../controllers/checkout');
const { validate } = require('../../../middleware');
const multer = require('multer');
const multParse = multer();

const ordersValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Obligatory field')
    .isLength({
      max: 20,
      min: 2
    })
    .withMessage('Wrong length')
    .custom(value => {
      if (!validator.isAlphanumeric(value, 'en-US')
        && !validator.isAlphanumeric(value, 'ru-RU')) {
        throw new Error('Wrong type');
      }
      return true;
    })
    .trim()
    .escape(),
  check('phone')
    .not()
    .isEmpty()
    .withMessage('Obligatory field')
    .trim()
    .escape(),
  check('email')
    .not()
    .isEmpty()
    .withMessage('Obligatory field')
    .not()
    .isEmail()
    .withMessage('Incorrect email')
    .trim()
    .escape(),
  check('surname')
    .optional()
    .isLength({
      max: 20,
      min: 2
    })
    .withMessage('Wrong length')
    .custom(value => {
      if (!validator.isAlphanumeric(value, 'en-US')
        && !validator.isAlphanumeric(value, 'ru-RU')) {
        throw new Error('Wrong type');
      }
      return true;
    })
    .trim()
    .escape(),
  check('name')
    .optional()
    .isLength({
      max: 20,
      min: 2
    })
    .withMessage('Wrong length')
    .custom(value => {
      if (!validator.isAlphanumeric(value, 'en-US')
        && !validator.isAlphanumeric(value, 'ru-RU')) {
        throw new Error('Wrong type');
      }
      return true;
    })
    .trim()
    .escape(),
  check('product')
    .not()
    .isEmpty()
    .custom(value => {
      if (!value.length) {
        throw new Error('Empty checkout');
      } else if (value.some(item => validator.isObjectId(item))) {}
      return true;
    })
];

router.get('/', ctrlCheckout.getAll);

router.get('/:id', ctrlCheckout.getById);

router.post('/', multParse.none(), validate(ordersValidator), ctrlCheckout.create);

router.put('/', multParse.none(), validate(ordersValidator), ctrlCheckout.update);

router.delete('', ctrlCheckout.delete);

module.exports = router;
