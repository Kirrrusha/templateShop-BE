const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const products = require('./products');
const passport = require('passport');

const auth = passport.authenticate('jwt', {
  session: false,
});

router.use('/users', users);
router.use('/products', products);
router.use('/articles', articles);

module.exports = router;
