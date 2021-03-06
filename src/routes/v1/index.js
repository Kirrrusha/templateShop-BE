const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const products = require('./products');
const category = require('./category');
const manufacturers = require('./manufacturer');
const widgets = require('./widget');
const pages = require('./pages');
const checkout = require('./checkout');
const passport = require('passport');

const auth = passport.authenticate('jwt', {
  session: false,
});

router.use('/users', users);
router.use('/products', products);
router.use('/articles', articles);
router.use('/categories', category);
router.use('/manufacturers', manufacturers);
router.use('/widgets', widgets);
router.use('/pages', pages);
router.use('/checkout', checkout);



module.exports = router;
