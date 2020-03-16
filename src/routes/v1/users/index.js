const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validator = require('validator');
const ctrlUsers = require('../../../controllers/users');
const { validate } = require('../../../middleware');

const ordersValidator = [
  check('username').not().isEmpty()
    .withMessage('Obligatory field')
    .isAlphanumeric('en-US')
    .withMessage('Wrong type'),
  check('password').not().isEmpty()
    .withMessage('Obligatory field')
    .isAlphanumeric('en-US')
    .withMessage('Wrong type'),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Wrong type'),
  check('surname')
    .optional()
    .custom(value => {
      if (!validator.isAlphanumeric(value, 'en-US')
        && !validator.isAlphanumeric(value, 'ru-RU')) {
        throw new Error('Wrong type');
      }
      return true;
    }),
  check('name')
    .optional()
    .custom(value => {
      if (!validator.isAlphanumeric(value, 'en-US')
        && !validator.isAlphanumeric(value, 'ru-RU')) {
        throw new Error('Wrong type');
      }
      return true;
    }),
  check('middleName')
    .optional()
    .custom(value => {
      if (!validator.isAlphanumeric(value, 'en-US')
        && !validator.isAlphanumeric(value, 'ru-RU')) {
        throw new Error('Wrong type');
      }
      return true;
    })
];

router.post('/login', validate(ordersValidator), ctrlUsers.auth);
router.post('/registration', validate(ordersValidator), ctrlUsers.registration);
router.get('/:id', ctrlUsers.getById);
router.put('/', validate(ordersValidator), ctrlUsers.updateUser);
router.delete('/', ctrlUsers.deleteUsers);

module.exports = router;
