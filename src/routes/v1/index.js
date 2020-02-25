const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const product = require('./product');
const passport = require('passport');

const auth = passport.authenticate('jwt', {
  session: false,
});

router.use('/users', users);
router.use('/product', product);
router.use('/articles', articles);

module.exports = router;
