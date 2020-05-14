const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validator = require('validator');
const ctrlUsers = require('../../../controllers/users');
const { validate } = require('../../../middleware');
const multer = require('multer');
const multParse = multer();
const {auth} = require('../../../controllers/users');

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
    .not().isEmpty()
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
router.get('/confirmation/:hash', multParse.none(), ctrlUsers.confirmation);
router.post(
  '/refresh-confirmation-token',
  multParse.none(),
  ctrlUsers.resendTokenPost
);
router.post('/resend', multParse.none(), validate(ordersValidator), ctrlUsers.resendTokenPost);
router.get(
  '/:id',
  auth,
  ctrlUsers.grantAccess('readAny', 'profile'),
  ctrlUsers.getById
);
router.get(
  '/',
  auth,
  ctrlUsers.grantAccess('readAny', 'profile'),
  ctrlUsers.getAll
);
router.put(
  '/',
  auth,
  ctrlUsers.grantAccess('updateAny', 'profile'),
  multParse.none(),
  validate(ordersValidator),
  ctrlUsers.updateUser
);
router.put('/changePassword', multParse.none(), validate(passwordValidator), ctrlUsers.changePassword);
router.delete(
  '/',
  auth,
  ctrlUsers.grantAccess('deleteAny', 'profile'),
  ctrlUsers.deleteUsers
);

module.exports = router;
