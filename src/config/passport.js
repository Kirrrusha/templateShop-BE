const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/users');
const key = require('../config').secretOrKey;

const options = {};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = key;
module.exports = (passport) => {
  passport.use(new JwtStrategy(options, (jwtPayload, done) => {
    User.findById(jwtPayload.id)
      .then((user) => (user ? done(null, user) : done(null, false)))
      .catch((error) => console.log(error));
  }));
};
