const router = require('express').Router();
const options = require('./options');
const groupAttributes = require('./group-attributes');
const attributes = require('./attributes');
const comments = require('./comments');
const manufactures = require('./manufactures');
const product = require('./product');

router.use('/options', options);
router.use('/group-attributes', groupAttributes);
router.use('/attributes', attributes);
router.use('/comments', comments);
router.use('/manufactures', manufactures);
router.use('/', product);

module.exports = router;
