const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const key = require('../config').secretOrKey;
const Users = require('../models/users');


exports.registration = (req, res) => {
  console.log(req.body);
  const {
    username,
    password,
    email,
    surname,
    name,
    middleName,
  } = req.body;
  Users.findOne({ username })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ message: 'User with this username already exists.' });
      }
      const newUser = new Users({
        username,
        email,
        surname,
        password,
        name,
        middleName,
      });
      bCrypt.genSalt(10, (error, salt) => {
        bCrypt.hash(password, salt, (err, hash) => {
          if (err) return res.status(404).json({ ...err });
          newUser.password = hash;
          newUser
            .save()
            .then(() => res.json({ message: 'Пользователь создан' }))
            .catch(({ message }) => res.status(404).json({ message }));
        });
      });
    })
    .catch(({ message }) => res.status(404).json({ message }));
};

exports.auth = (req, res) => {
  const { username, password, email } = req.body;

  Users.findOne({ username, email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'Неправильный логин или пароль',
        });
      }
      if (user && bCrypt.compareSync(password, user.password)) {
        const payload = { id: user._id, username: user.username };

        jwt.sign(payload, key, { expiresIn: 86400 }, (err, token) => {
          if (err) res.status(404).json({ ...err });
          res.json({
            id: user._id,
            username: user.username,
            password: user.password,
            surname: user.surname,
            name: user.name,
            middleName: user.middleName,
            token,
          });
        });
      }
    }).catch(({ message }) => res.status(500).json({ message }));
};

exports.updateUser = (req, res) => {
  const { surname, name, middleName } = req.body;
  const { id } = req.params;
  User.updateOne({ _id: id }, { surname, name, middleName })
    .then(() => res.json({ surname, name, middleName }))
    .catch(({ message }) => res.status(404).json({ message }));
};

exports.deleteUser = ({ params }, res) => {
  User.deleteOne({ _id: params.id })
    .then(() => res.json({ message: 'ok' }))
    .catch(({ message }) => res.status(404).json({ message }));
};
