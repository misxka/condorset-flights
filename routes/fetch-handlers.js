const authJwt = require("../util/jwt-auth");

const express = require('express');

const router = express.Router();

router.post(
  "/votes",
  function(req, res) {
    console.log(req.body);
    res.json({condition: "Успешно"});
  }
);

module.exports = router;