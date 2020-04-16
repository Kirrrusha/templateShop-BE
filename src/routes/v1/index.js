const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const products = require('./products');
const category = require('./category');
const manufacturers = require('./manufacturer');
const widgets = require('./widget');
const pages = require('./pages');
const passport = require('passport');

const auth = passport.authenticate('jwt', {
  session: false,
});

router.use('/users', users);
router.use('/products', products);
router.use('/articles', articles);
router.use('/categories', category);
router.use('/manufacturer', manufacturers);
router.use('/widgets', widgets);
router.use('/pages', pages);



module.exports = router;
