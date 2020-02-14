const { version } = require('../../package.json');
const router = require('express').Router();
const v1 = require('./v1');

router.use('/v1', v1);

router.get('/', (req, res) => res.json({ version }));

module.exports = router;
