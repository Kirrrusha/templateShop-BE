const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const ctrlProduct = require('../../../controllers/product');
const { validate } = require('../../../middleware');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('req storage', req.body)
    cb(null, './src/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("File format should be PNG,JPG,JPEG"), false);
    }
  }
});

router.get('/', ctrlProduct.getAll);

// router.get('/search', ctrlProduct.productsByQuery);
router.get('/byCategory', ctrlProduct.productsByCategoryId);

router.get('/:id', ctrlProduct.getById);

router.post('/',
  upload.array('photos', 12),
  ctrlProduct.create
);

router.put('/',
  upload.array('photos', 12),
  ctrlProduct.update
);

router.delete('', ctrlProduct.delete);

module.exports = router;
