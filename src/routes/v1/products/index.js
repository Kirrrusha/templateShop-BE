const router = require('express').Router();
const options = require('./options');
const groupAttributes = require('./group-attributes');
const attributes = require('./attributes');

router.get('/', (req, res) => res.json({ message: 'version' }));
router.use('/options', options);
router.use('/group-attributes', groupAttributes);

router.use('/attributes', attributes);

module.exports = router;
