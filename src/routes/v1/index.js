const version = require('../../../package.json').version;
const config = require('../../config');
const router = require('express').Router();
const users = require('./users');
const RateLimit = require('express-rate-limit');
const passport = require('passport');

const auth = passport.authenticate('jwt', {
  session: false
});

const apiLimiter = new RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.get('/', (req, res) => res.json({
  version,
  config,
  env: process.env.NODE_ENV,
}));

router.use('/users', apiLimiter, users);

module.exports = router;
