const version = require('../../../package.json').version;
const config = require('../../config');
const Router = require('express').Router;

module.exports = () => {
  let api = Router();

  // api.use(/* auth middleware */);
  console.log('1')

  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => res.json({
    version,
    config,
    env: process.env.NODE_ENV,
  }));

  return api;
};
