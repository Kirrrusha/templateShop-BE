const defaultConfig = require('./default.json');


const config = {
  env: process.env.NODE_ENV,
  ...defaultConfig,
};

// define env vars into config
config.port = process.env.PORT || config.port;
config.url = process.env.RESOURCE_URL || config.url;
config.mongoURI = process.env.MONGODB_URI || config.mongoURI;
config.secretOrKey = process.env.SECRET_OR_KEY || config.secretOrKey;
config.expiresIn = process.env.expiresIn || config.expiresIn;

console.log(config);

module.exports = config;
