const authJwt = require("../util/jwt-auth");

const express = require('express');

const router = express.Router();

const fetchHandlersController = require('../controllers/fetch-handlers');

router.get(
  "/available-dates",
  fetchHandlersController.getAvailableDates
);

router.get(
  '/entered-dates',
  fetchHandlersController.getEnteredDates
)

router.get(
  '/editable-dates',
  fetchHandlersController.getEditableDates
)

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
  fetchHandlersController.stopVoting,
  fetchHandlersController.applyMethod,
  fetchHandlersController.changeRecordsInDB
)

router.get(
  "/closed-dates",
  fetchHandlersController.getClosedDates
);

router.post(
  '/get-pre-final-schedule',
  fetchHandlersController.getPreFinalSchedule
)

router.post(
  '/add-final-schedule',
  fetchHandlersController.addFinalSchedule
)

router.get(
  '/get-users',
  fetchHandlersController.getUsers
)

router.post(
  '/delete-user',
  fetchHandlersController.deleteUser
)

module.exports = router;