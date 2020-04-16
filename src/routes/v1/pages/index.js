const express = require('express');
const router = express.Router();
const validator = require('validator');
const { check } = require('express-validator');
const ctrlPage = require('../../../controllers/page');
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
      if (!validator.isAlphanumeric(value, 'en-US')) {
        throw new Error('Wrong type');
      }
      return true;
    })
    .trim()
    .escape(),
  check('widgets')
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

router.get('/', ctrlPage.getAll);

router.get('/:id', ctrlPage.getById);

router.post('/', multParse.none(), validate(ordersValidator), ctrlPage.create);

router.put('/', multParse.none(), validate(ordersValidator), ctrlPage.update);

router.delete('', ctrlPage.delete);

module.exports = router;
