const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlComments = require('../../../controllers/product/comments');
const { validate } = require('../../../middleware');

const ordersValidator = [
  check('text').isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('некорректный тип поля'),
  check('productId').isEmpty()
    .withMessage('Обязательное поле')
    .isAlphanumeric('en-US')
    .withMessage('некорректный тип поля'),
  check('authorId')
    .isAlphanumeric('en-US')
    .withMessage('некорректный тип поля'),
  check('rating')
    .isNumeric()
    .withMessage('некорректный тип поля'),
  check('visible')
    .isBoolean()
    .withMessage('некорректный тип поля'),

];

router.get('/', ctrlComments.getAll);

router.get('/:id', ctrlComments.getById);

router.post('/', validate(ordersValidator), ctrlComments.create);

router.put('/', validate(ordersValidator), ctrlComments.update);

router.delete('', ctrlComments.delete);

module.exports = router;
