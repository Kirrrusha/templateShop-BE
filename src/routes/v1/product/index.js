const router = require('express').Router();
const options = require('./options');
const groupAttributes = require('./group-attributes');
const attributes = require('./attributes');

router.use('/options', options);
router.use('/group-attributes', groupAttributes);
router.use('/attributes', attributes);

module.exports = router;
