const authJwt = require("../util/jwt-auth");

const express = require('express');

const router = express.Router();

router.post(
  "/votes",
  function(req, res) {
    res.json({condition: "Успешно"});
  }
);

router.get(
  "/available-dates",
  function(req, res) {
    res.json(['12.05.2021', '09.05.2021']);
  }
);

router.post(
  "/votes-stats",
  function(req, res) {
    if(req.body.date === '12.05.2021') {
      res.json([
        {
          label: 'ABC',
          numberOfVotes: 7
        },
        {
          label: 'BAC',
          numberOfVotes: 4
        },
        {
          label: 'CAB',
          numberOfVotes: 9
        }
      ]);
    } else {
      res.json([
        {
          label: 'ABC',
          numberOfVotes: 7
        },
        {
          label: 'BAC',
          numberOfVotes: 4
        },
        {
          label: 'CAB',
          numberOfVotes: 9
        },
        {
          label: 'ACB',
          numberOfVotes: 2
        },
        {
          label: 'BCA',
          numberOfVotes: 7
        }
      ]);
    }
  }
);

router.post(
  '/temp-tables',
  function(req, res) {
    console.log(req.body);
  }
)

module.exports = router;