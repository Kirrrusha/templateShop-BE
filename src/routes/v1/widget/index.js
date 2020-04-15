const express = require('express');
const router = express.Router();
const validator = require('validator');
const { check } = require('express-validator');
const ctrlModule = require('../../../controllers/widget');
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
  check('products')
    .not()
    .isEmpty()
    .custom(value => {
      if (!value.length) {
        throw new Error('Empty checkout');
      } else if (!value.every(item => validator.isObjectId(item))) {
        throw new Error('Wrong type');
      }
      return true;
    })
];

router.get('/', ctrlModule.getAll);

router.get('/:id', ctrlModule.getById);

router.post('/', multParse.none(), validate(ordersValidator), ctrlModule.create);

router.put('/', multParse.none(), validate(ordersValidator), ctrlModule.update);

router.delete('', ctrlModule.delete);

module.exports = router;
