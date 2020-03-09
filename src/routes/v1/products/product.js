const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlProduct = require('../../../controllers/product');
const { validate } = require('../../../middleware');

// const ordersValidator = [
//   check('name').isEmpty()
//     .withMessage('Обязательное поле')
//     .isAlphanumeric('en-US')
//     .withMessage('Неверный тип данных')
//     .isLength({max: 15, min: 2})
//     .withMessage('Некорректная длина названия'),
//   check('description')
//     .isAlphanumeric('en-US')
//     .withMessage('Неправильное значение')
//     .isLength({max: 50})
//     .withMessage('Слишком длинное описание')
//   ,
//   check('status').isBoolean()
//     .withMessage('Неверный тип данных')
// ];

router.get('/', ctrlProduct.getAll);

router.get('/:id', ctrlProduct.getById);

router.post('/', ctrlProduct.create);

router.put('/', ctrlProduct.update);

router.delete('', ctrlProduct.delete);

module.exports = router;
