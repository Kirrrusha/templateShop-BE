const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const ctrlManufacturers = require('../../controllers/manufacturer');
const { validate } = require('../../middleware');
const multer = require('multer');
const path = require('path');
const Manufacturer = require('../../models/manufacturer');
const { isEmpty } = require('lodash');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: async (req, file, cb) => {
    if (file.mimetype !== 'image/png') {
      return cb(null, false, new Error('I don\'t have a clue!'));
    }
    if (req.method !== 'PUT') {
      try {
        const manufacturer = Manufacturer.findOne({ name: req.body.name }).exec();
        if (!isEmpty(manufacturer)) {
          cb(new Error('Manufacture already exist'), false);
        }
        cb(null, true);
      } catch (e) {
        cb(null, false, new Error(e));
      }
    }
    cb(null, true);
  }
});

router.get('/', ctrlManufacturers.getAll);

router.get('/:id', ctrlManufacturers.getById);

router.post('/', upload.single('img'), ctrlManufacturers.create);

router.put('/', upload.single('img'), ctrlManufacturers.update);

router.delete('', ctrlManufacturers.delete);

module.exports = router;
