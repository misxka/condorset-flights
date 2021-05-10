const authJwt = require("../util/jwt-auth");

const express = require('express');

const router = express.Router();

// router.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Headers",
//     "x-access-token, Origin, Content-Type, Accept"
//   );
//   next();
// });

router.post(
  "/votes",
  // authJwt.verifyToken,
  function(req, res) {
    console.log(req.body);
    res.json({condition: "Успешно"});
  }
);

module.exports = router;