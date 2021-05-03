const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const accessTokenSecret = '466beebafb8365c8bf3e151f49b1d0e946103f14e7d06fcf6e99106c273ad726ea73bf0d2586159e4047c1ada3a6b863f5cf3358fd95c5618c2a5fe3977668e6';
const refreshTokenSecret = 'b034760e00f08563f4172727798ef7fddfb70bc4fa8baec5ce6a65d8ab8c0463526a93bccdccbbf5f0497b4037bcc5187fc91400051a2b1e90fea1f993713049';

verifyToken = (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

module.exports = {
  verifyToken: verifyToken,
  isAdmin: isAdmin
};