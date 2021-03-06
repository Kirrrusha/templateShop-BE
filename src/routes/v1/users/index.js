const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validator = require('validator');
const ctrlUsers = require('../../../controllers/users');
const { validate } = require('../../../middleware');
const multer = require('multer');
const multParse = multer();

const ordersValidator = [
  check('username').not().isEmpty()
    .withMessage('Obligatory field')
    .isAlphanumeric('en-US')
    .withMessage('Wrong type'),
  check('role')
    .optional()
    .isIn(['basic', 'supervisor'])
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

const passwordValidator = [
  check('password').not().isEmpty()
    .withMessage('Obligatory field')
    .isAlphanumeric('en-US')
    .withMessage('Wrong type')
    .trim().escape()
]

router.post('/login', multParse.none(), validate(ordersValidator), ctrlUsers.auth);
router.post('/registration', multParse.none(), validate(ordersValidator), ctrlUsers.registration);
router.get('/:id', ctrlUsers.getById);
router.get('/', ctrlUsers.getAll);
router.put('/', multParse.none(), validate(ordersValidator), ctrlUsers.updateUser);
router.put('/changePassword', multParse.none(), validate(passwordValidator), ctrlUsers.changePassword);
router.delete('/', ctrlUsers.deleteUsers);

module.exports = router;
