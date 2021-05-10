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

router.get(
  "/available-dates",
  function(req, res) {
    console.log(req.body);
    res.json(['12.05.2021', '09.05.2021']);
  }
);

module.exports = router;