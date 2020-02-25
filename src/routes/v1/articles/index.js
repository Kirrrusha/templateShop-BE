const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlArticles = require('../../../controllers/articles');
const { validate } = require('../../../middleware');

const ordersValidator = [
  check('name').isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('Неверный тип данных'),
  check('text')
    .isAlphanumeric('en-US')
    .withMessage('Неправильное значение'),
  check('status').isBoolean()
    .withMessage('Неверный тип данных')
];

router.get('/', ctrlArticles.getAll);

router.get('/:id', ctrlArticles.getById);

router.post('/', validate(ordersValidator), ctrlArticles.create);

router.put('/', validate(ordersValidator), ctrlArticles.update);

router.delete('/:id', ctrlArticles.delete);

module.exports = router;
