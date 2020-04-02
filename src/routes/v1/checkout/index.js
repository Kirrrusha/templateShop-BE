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
  check('surname')
    .optional()
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
  check('product')
    .not()
    .isEmpty()
    .custom(value => {
      if (!value.length) {
        throw new Error('Empty checkout');
      } else if (value.some(item => validator.isObjectId(item))) {}
      return true;
    }),
  check('status')
    .optional()
    .isBoolean()
    .withMessage('Wrong type')
];

router.get('/', ctrlCategory.getAll);

router.get('/:id', ctrlCategory.getById);

router.post('/', multParse.none(), validate(ordersValidator), ctrlCategory.create);

router.put('/', multParse.none(), validate(ordersValidator), ctrlCategory.update);

router.delete('', ctrlCategory.delete);

module.exports = router;
