const path = require('path');

const express = require('express');

const authenticationController = require('../controllers/authentication');

const router = express.Router();

router.post('/sign-in', authenticationController.signIn);

router.post('/sign-up', authenticationController.signUp);

router.get('/sign-up', (req, res) => {
  res.redirect('/');
});

router.get('/sign-in', (req, res) => {
  res.redirect('/');
});

module.exports = router;