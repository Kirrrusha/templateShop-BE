const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secretOrKey: key, expiresIn, subject, smtp} = require('../config');
const User = require('../models/user');
const Token = require('../models/token');
const {errorHandler} = require('../lib/util');
const {roles} = require('../models/roles');
const nodemailer = require('nodemailer');

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

    let verifyToken = await bCrypt.hash(`${savedUser._id}`, salt);
    verifyToken = verifyToken.replace(/\//g, "slash");
    const token = new Token({user: savedUser._id, token: verifyToken});
    await token.save();

    const transporter = nodemailer.createTransport(smtp);
    const mailOptions = {
      from: smtp.auth.user,
      to: email,
      subject: subject,
      text: `Hello,\n\n Please verify your account by clicking the link: \n
      http://${req.headers.host}/api/v1/users/confirmation/${verifyToken}\n`
    };
    await transporter.sendMail(mailOptions);

    await res.json({message: 'Check your email'});
  } catch (e) {
    errorHandler({
      message: e.message,
      statusCode: 401
    }, next);
  }
};

exports.auth = async (req, res, next) => {
  const {username, password} = req.body;

  try {
    const user = await User.findOne({username});

    if (!user) {
      new Error('Wrong login or password');
    }

    const match = await bCrypt.compare(password, user.password);
    if (!user.isVerified) throw new Error('Your account has not been verified.');

    if (match) {
      const payload = {id: user._id, username: user.username};
      const token = jwt.sign(payload, key, {expiresIn});
      await res.json({token});
    } else {
      new Error('Wrong login or password');
    }
  } catch (e) {
    errorHandler({
      message: e.message,
      statusCode: 401
    }, next);
  }
};

exports.confirmation = async (req, res, next) => {
  const {params: {hash}} = req;
  try {
    const tokenModel = await Token.findOne({token: hash}).exec();
    if (!tokenModel) new Error('We were unable to find a valid token. Your token my have expired.')
    const user = await User.findById(tokenModel.user).exec();
    if (!user) throw new Error('We were unable to find a user for this token.');
    if (user.isVerified) new Error('This user has already been verified.');
    user.isVerified = true;
    await user.save();

    const payload = {
      id: user._id,
      username: user.username
    };

    const token = jwt.sign(payload, key, {expiresIn});
    await res.json({token});
  } catch ({message}) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.resendTokenPost = async (req, res, next) => {
  const {body: {email}} = req;
  try {
    const user = await User.findOne({email});
    const salt = await bCrypt.genSalt(10);
    let verifyToken = await bCrypt.hash(`${user._id}`, salt);
    verifyToken = verifyToken.replace(/\//g, "slash");

    if (!user) throw new Error('We were unable to find a user for this token.');
    if (user.isVerified) throw new Error('This user has already been verified.');

    const token = new Token({user: user._id, token: verifyToken});
    await token.save();
    const transporter = nodemailer.createTransport(smtp);
    const mailOptions = {
      from: smtp.auth.user,
      to: user.email,
      subject: subject,
      text: `Hello,\n\n Please verify your account by clicking the link: \n
      http://${req.headers.host}/api/v1/users/confirmation/${verifyToken}\n`
    };
    await transporter.sendMail(mailOptions);
  } catch ({message}) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find({});
    await res.json(users.map(user => user.toJSON()));
  } catch ({message}) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.getById = async (req, res, next) => {
  const {id} = req.params;
  try {
    const user = await User.findById(id);
    await res.json(user.toJSON());
  } catch ({message}) {
    errorHandler({
      message,
      statusCode: 401
    }, next);
  }
};

exports.updateUser = async (req, res, next) => {
  const {id, surname, email, name, middleName, role} = req.body;

  try {
    const user = await User.findById(id).exec();
    user.surname = surname || user.surname;
    user.email = email || user.email;
    user.name = name || user.name;
    user.middleName = middleName || user.middleName;
    user.role = role || user.role;
    await user.save();
    await res.json(user.toJSON());
  } catch (e) {
    errorHandler({
      message: e.message,
      statusCode: 401
    }, next);
  }
};

exports.changePassword = async (req, res, next) => {
  const {id, oldPassword, newPassword} = req.body;
  try {
    const salt = await bCrypt.genSalt(10);
    const hashOldPassword = await bCrypt.hash(oldPassword, salt);
    const user = await User.findById(id).exec();
    if (user.password !== hashOldPassword) {
      return errorHandler({
        message: 'Incorrect password!',
        statusCode: 401
      }, next);
    }
    user.password = await bCrypt.hash(newPassword || hashOldPassword, salt);
    await user.save();
    await res.json(user.toJSON());
  } catch (e) {
    errorHandler({
      message: e.message,
      statusCode: 401
    }, next);
  }
};

exports.deleteUsers = async (req, res, next) => {
  const {id} = req.query;
  try {
    await User.deleteMany({_id: {$in: id}});
    res.end();
  } catch ({message}) {
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
    } catch ({message}) {
      return errorHandler({
        message
      }, next);
    }
  };
};
