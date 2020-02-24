const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlGroupAttributes = require('../../../controllers/product/groupAttributes');
const { validate } = require('../../../middleware');

const ordersValidator = [
  check('name').isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('name должен быть из чисел и букв')
];

router.get('/', ctrlGroupAttributes.getAll);

router.get('/:id', ctrlGroupAttributes.getById);

router.post('/', validate(ordersValidator), ctrlGroupAttributes.create);

router.put('/', validate(ordersValidator), ctrlGroupAttributes.update);

router.delete('/:id', ctrlGroupAttributes.delete);

module.exports = router;
