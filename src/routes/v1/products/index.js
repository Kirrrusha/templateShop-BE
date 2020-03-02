const router = require('express').Router();
const options = require('./options');
const groupAttributes = require('./group-attributes');
const attributes = require('./attributes');
const comments = require('./comments');

router.use('/options', options);
router.use('/group-attributes', groupAttributes);
router.use('/attributes', attributes);
router.use('/comments', comments);

module.exports = router;
