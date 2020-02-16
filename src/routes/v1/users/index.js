const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlUsers = require('../../../controllers/users');
const { validate } = require('../../../middleware');

const ordersValidator = [
  check('username').isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('Username должен быть из чесел и букв'),
  check('password').isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('Пароль должен быть из чесел и букв'),
  check('email').isEmpty()
    .withMessage('Обязательное поле')
    .isEmail('Это не email')
    .withMessage('Пароль должен быть из чесел и букв'),
];

router.post('/login', validate(ordersValidator), ctrlUsers.auth);

router.post('/registration', validate(ordersValidator), ctrlUsers.registration);

module.exports = router;
