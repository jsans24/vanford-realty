const express = require('express');
const router = express.Router();

const db = require('../models');

router.get('/', (req, res) => {
  db.Realtor.find({}, (err, allRealtors) => {
    if (err) return console.log(err);

    res.render('realtors/index', {allRealtors});
  });
});

module.exports = router;