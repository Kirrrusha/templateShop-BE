const router = require('express').Router();
const options = require('./options');

router.use('/options', options);

module.exports = router;
