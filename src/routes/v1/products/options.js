const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlProductOptions = require('../../../controllers/option');
const { validate } = require('../../../middleware');

const ordersValidator = [
  check('name').isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('name должен быть из чисел и букв'),
  check('optionType').isEmpty()
    .withMessage('Обязательное поле')
    .isAlpha('en-US')
    .withMessage('Неправильное значение'),
  check('optionValues').custom(value => {
    const result = value.length && value.some(val => val.isAlpha('en-US'))
    return !result && 'Некорректное значение optionValues'
  }),
];

router.get('/', ctrlProductOptions.getAll);

router.get('/:id', ctrlProductOptions.getById);

router.post('/', validate(ordersValidator), ctrlProductOptions.create);

router.put('/', validate(ordersValidator), ctrlProductOptions.update);

router.delete('/:id', ctrlProductOptions.delete);

module.exports = router;
