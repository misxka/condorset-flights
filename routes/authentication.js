const path = require('path');

const express = require('express');

const authenticationController = require('../controllers/authentication');
const checkDuplicate = require('../util/check-duplicate');

const router = express.Router();

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post('/sign-in', authenticationController.signIn);

router.post(
  '/sign-up', 
  checkDuplicate,
  authenticationController.signUp
);

router.get('/sign-up', (req, res) => {
  res.redirect('/');
});

router.get('/sign-in', (req, res) => {
  res.redirect('/');
});

module.exports = router;