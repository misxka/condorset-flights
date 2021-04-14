const {Op} = require('sequelize');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../util/database');
const User = db.user;
const Role = db.role;

const accessTokenSecret = 'schedulebasedoncondorcetmethod';

exports.signIn = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({
    where: {
      username: username
    }
  })
  .then(user => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    var token = jwt.sign({ id: user.id }, accessTokenSecret, {
      expiresIn: 86400
    });

    var authorities = [];
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.signUp = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  try {
    await User.findOrCreate({
      where: {
        [Op.or]: [
          {username: username},
          {email: email}
        ]
      },
      defaults: {
        username: username,
        email: email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      }
    })
    .then(results => {
      if(results[1]) {
        results[0].setRoles([1]).then(() => {
          res.render('greeting', {
            pageTitle: 'Расписание Кондорсе',
            path: 'greeting',
            greeting: "Вы успешно зарегистрированы!" 
          });
        });
        console.log("Создан новый пользователь...");
      } else console.log("Такой пользователь уже существует...");
    }); 
  } catch (err) {
    console.log(`ERROR! => ${err.name}: ${err.message}`);
    res.status(500).send(err.message);
  }
};