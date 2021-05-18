const authJwt = require("../util/jwt-auth");
const authorizationController = require('../controllers/authorization');
const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get(
  "/user",
  [authJwt.verifyToken]
);

router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  authorizationController.adminBoard
);

module.exports = router;