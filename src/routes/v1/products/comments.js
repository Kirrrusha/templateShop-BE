const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlComments = require('../../../controllers/comments');
const isNumber = require('lodash');
const { validate } = require('../../../middleware');
const validator = require('validator');
const multer = require('multer');
const multParse = multer();

const ordersValidator = [
  check('text').not().isEmpty()
    .withMessage('Obligatory field')
    .isLength({
      max: 300,
      min: 2
    })
    .withMessage('Wrong length').trim().escape(),
  check('product').not().isEmpty()
    .withMessage('Obligatory field')
    .isMongoId()
    .withMessage('Wrong type'),
  check('author').
    optional()
    .isMongoId()
    .withMessage('Wrong type'),
  check('rating')
    .optional()
    .custom(value => {
      if (!isNumber(value)) {
        throw new Error('Wrong type');
      }
      return true;
    }),
  check('visible')
    .optional()
    .isBoolean()
    .withMessage('Wrong type'),
];

router.get('/', ctrlComments.getAll);

router.get('/:id', ctrlComments.getById);
router.get('/product/:id', ctrlComments.getCommentsByProductId);

router.post('/', multParse.none(), validate(ordersValidator), ctrlComments.create);

router.put('/', multParse.none(), validate(ordersValidator), ctrlComments.update);

router.delete('', ctrlComments.delete);

module.exports = router;
