const {Op} = require('sequelize');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../util/database');
const User = db.user;
const Role = db.role;

const accessTokenSecret = '466beebafb8365c8bf3e151f49b1d0e946103f14e7d06fcf6e99106c273ad726ea73bf0d2586159e4047c1ada3a6b863f5cf3358fd95c5618c2a5fe3977668e6';
// const refreshTokenSecret = 'b034760e00f08563f4172727798ef7fddfb70bc4fa8baec5ce6a65d8ab8c0463526a93bccdccbbf5f0497b4037bcc5187fc91400051a2b1e90fea1f993713049';

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
      return res.status(401).json({ 
        exists: false,
        correctPassword: undefined
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        exists: true,
        correctPassword: false
      });
    }

    const token = jwt.sign({ id: user.id }, accessTokenSecret, {
      algorithm: "HS256",
      expiresIn: 1800
    });

    const authorities = [];
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push(roles[i].rolename);
      }
      res.cookie('token', token, {httpOnly: true});
      res.json({
        exists: true,
        correctPassword: true
      });
    })
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
            greeting: `Добро пожаловать, ${username}. Вы успешно зарегистрированы!` 
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