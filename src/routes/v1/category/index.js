const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlCategory = require('../../../controllers/category');
const { validate } = require('../../../middleware');

const ordersValidator = [
  check('name').not().isEmpty()
    .withMessage('Obligatory field')
    .isLength({max: 15, min: 2})
    .withMessage('Wrong length')
    .custom(value => {
      if (!validator.isAlphanumeric(value, 'en-US')
        && !validator.isAlphanumeric(value, 'ru-RU')) {
        throw new Error('Wrong type');
      }
      return true;
    }),
  check('description')
    .optional()
    .custom(value => {
      if (!validator.isAlphanumeric(value, 'en-US')
        && !validator.isAlphanumeric(value, 'ru-RU')) {
        throw new Error('Wrong type');
      }
      return true;
    })
    .isLength({max: 50})
    .withMessage('Too much long'),
  check('status').isBoolean()
    .withMessage('Wrong type')
];

router.get('/', ctrlCategory.getAll);

router.get('/:id', ctrlCategory.getById);

router.post('/', validate(ordersValidator), ctrlCategory.create);

router.put('/', validate(ordersValidator), ctrlCategory.update);

router.delete('', ctrlCategory.delete);

module.exports = router;
