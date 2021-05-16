const authJwt = require("../util/jwt-auth");

const express = require('express');

const router = express.Router();

const fetchHandlersController = require('../controllers/fetch-handlers');

router.get(
  "/available-dates",
  fetchHandlersController.getEnteredDates
);

router.post(
  '/add-votes',
  fetchHandlersController.addVotes
)

router.post(
  '/voted-users',
  authJwt.verifyToken,
  fetchHandlersController.checkVotedUsers
)

router.post(
  "/votes-stats",
  fetchHandlersController.getVotesStats
);

router.post(
  '/temp-tables',
  fetchHandlersController.findDateInfo,
  fetchHandlersController.addTempFlights
)

router.post(
  '/get-temp-flights',
  fetchHandlersController.getTempFlights
)

router.post(
  '/check-status',
  fetchHandlersController.checkStatus
)

router.post(
  '/get-final-schedule',
  fetchHandlersController.getFinalSchedule
)

router.post(
  '/stop-voting',
  fetchHandlersController.stopVoting
)

module.exports = router;