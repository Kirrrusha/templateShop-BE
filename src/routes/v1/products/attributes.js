const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlAttributes = require('../../../controllers/product/attributes');
const { validate } = require('../../../middleware');

const ordersValidator = [
  check('name').isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('name должен быть из чисел и букв'),
  check('groupId').isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('некорректный тип поля')
];

router.get('/', ctrlAttributes.getAll);

router.get('/:id', ctrlAttributes.getById);

router.post('/', validate(ordersValidator), ctrlAttributes.create);

router.put('/', validate(ordersValidator), ctrlAttributes.update);

router.delete('/:id', ctrlAttributes.delete);

module.exports = router;
