const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');

router.get('/', (req, res) => {
  req.logout();
  req.user=null;
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;