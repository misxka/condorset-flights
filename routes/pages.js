const authJwt = require("../util/jwt-auth");
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
  "/voting",
  [authJwt.verifyToken]
);

router.get(
  "/reports",
  [authJwt.verifyToken]
)

router.get(
  "/create-flights",
  [authJwt.verifyToken, authJwt.isAdmin]
);

router.get(
  "/admin-voting",
  [authJwt.verifyToken, authJwt.isAdmin]
);

router.get(
  "/admin-reports",
  [authJwt.verifyToken, authJwt.isAdmin]
);

module.exports = router;