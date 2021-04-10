const User = require('../models/user');

exports.signIn = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
}

exports.signUp = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  User.create({
    username: username,
    password: password,
    email: email,
    role: 'member'
  })
  .then(result => {
    console.log('New user created...');
  })
  .catch(err => {
    console.log(err);
  });
};