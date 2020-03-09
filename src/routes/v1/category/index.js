const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlCategory = require('../../../controllers/category');
const { validate } = require('../../../middleware');

const ordersValidator = [
  check('name').isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('Неверный тип данных')
    .isLength({max: 15, min: 2})
    .withMessage('Некорректная длина названия'),
  check('description')
    .isAlphanumeric('en-US')
    .withMessage('Неправильное значение')
    .isLength({max: 50})
    .withMessage('Слишком длинное описание')
  ,
  check('status').isBoolean()
    .withMessage('Неверный тип данных')
];

router.get('/', ctrlCategory.getAll);

router.get('/:id', ctrlCategory.getById);

router.post('/', validate(ordersValidator), ctrlCategory.create);

router.put('/', validate(ordersValidator), ctrlCategory.update);

router.delete('', ctrlCategory.delete);

module.exports = router;
