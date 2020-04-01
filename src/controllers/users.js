const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretOrKey: key, expiresIn } = require('../config');
const User = require('../models/user');
const { errorHandler } = require('../lib/util');
const { roles } = require('../models/roles');

exports.registration = async (req, res, next) => {
  const {
    username,
    password,
    email,
    surname,
    name,
    middleName,
    role
  } = req.body;
  const user = await User.findOne({
    username,
    email
  });

  if (user) {
    return errorHandler({
      message: 'Users with this username already exists.',
      statusCode: 401
    }, next);
  }
  const newUser = new User({
    username,
    email,
    surname,
    role,
    password,
    name,
    middleName
  });

  try {
    const salt = await bCrypt.genSalt(10);
    newUser.password = await bCrypt.hash(password, salt);

    const savedUser = await newUser.save();
    const payload = {
      id: savedUser._id,
      username: savedUser.username
    };

    const token = jwt.sign(payload, key, { expiresIn });
    await res.json({
      ...newUser.toJSON(),
      token
    });
  } catch (e) {
    errorHandler({
      message: e.message,
      statusCode: 401
    }, next);
  }
};

exports.auth = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return errorHandler({
      message: 'Wrong login or password',
      statusCode: 401
    }, next);
  }

  try {
    const match = await bCrypt.compare(password, user.password);
    if (match) {
      const payload = { id: user._id, username: user.username };
      const token = jwt.sign(payload, key, { expiresIn });
      await res.json({
        ...user.toJSON(),
        token
      });
    } else {
      return errorHandler({
        message: 'Wrong login or password',
        statusCode: 401
      }, next);
    }
  } catch (e) {
    return errorHandler({
      message: e.message,
      statusCode: 401
    }, next);
  }
};

exports.getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    await res.json(user.toJSON());
  } catch ({ message }) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.updateUser = async (req, res, next) => {
  const { id, password, surname, email, name, middleName, role } = req.body;

  try {
    const salt = await bCrypt.genSalt(10);
    const hashPassword = await bCrypt.hash(password, salt);
    const user = await User.findById(id).exec();
    user.password = hashPassword;
    user.surname = surname;
    user.email = email;
    user.name = name;
    user.middleName = middleName;
    user.role = role;
    await user.save();
    await res.json(user.toJSON())
  } catch (e) {
    errorHandler({
      message: e.message,
      statusCode: 401
    }, next);
  }
};

exports.deleteUsers = async ({ id }, res, next) => {
  try {
    await User.deleteMany({ _id: { $in: id } });
    res.end()
  } catch ({ message }) {
    return errorHandler({
      message
    }, next);
  }
};

exports.grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401)
          .json({
            error: 'You don\'t have enough permission to perform this action'
          });
      }
      next();
    } catch (error) {
      res.status(400)
        .json({ message: error.message });
      next(error);
    }
  };
};
