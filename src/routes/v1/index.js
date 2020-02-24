const router = require('express').Router();
const users = require('./users');
const product = require('./product');
const passport = require('passport');

const auth = passport.authenticate('jwt', {
  session: false,
});

router.use('/users', users);
router.use('/product', product);

module.exports = router;
