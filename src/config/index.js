const defaultConfig = require('./default.json');
const development = require('./development.json');

const envConfig = {
  development
}[process.env.NODE_ENV] || {};

const config = {
  env: process.env.NODE_ENV,
  ...defaultConfig,
  ...envConfig
};

// define env vars into config
config.port = process.env.PORT || config.port;
config.url = process.env.RESOURCE_URL || config.url;
config.mongoURI = process.env.MONGO_URI || config.mongoURI;
config.secretOrKey = process.env.SECRET_OR_KEY || config.secretOrKey;

console.log(config);

module.exports = config;
