const router = require('express').Router();
const users = require('./users');
const articles = require('./articles');
const products = require('./products');
const category = require('./category');
const manufactures = require('./manufacturer');
const passport = require('passport');

const auth = passport.authenticate('jwt', {
  session: false,
});

router.use('/users', users);
router.use('/products', products);
router.use('/articles', articles);
router.use('/categories', category);
router.use('/manufactures', manufactures);



module.exports = router;
