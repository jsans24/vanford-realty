const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../models');

router.get('/', (req, res) => res.render('login', {user: req.user}));

router.post('/', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/listings',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;