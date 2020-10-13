const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
    db.Realtor.create(req.body, (err, newRealtor) => {
        if(err) return console.log(err)
        res.redirect('/login/')
    });
});

module.exports = router;