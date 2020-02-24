const router = require('express').Router();
const options = require('./options');
const groupAttributes = require('./group-attributes');

router.use('/options', options);
router.use('/group-attributes', groupAttributes);

module.exports = router;
