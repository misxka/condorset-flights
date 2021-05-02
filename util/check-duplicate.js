const db = require("./database");
const User = db.user;

module.exports = checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Данный логин уже используется!"
      });
      return;
    }

    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Данный email уже используется!"
        });
        return;
      }

      next();
    });
  });
};