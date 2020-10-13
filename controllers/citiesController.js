const express = require('express');
const router = express.Router();
const db = require('../models');

//index route - Complete
router.get('/', (req, res) => {
    db.City.find({}, (err, cities) => {
        if(err) return console.log(err);
        res.render('cities/index', {cities})
    });
});

//show route - Complete
router.get('/:id', (req, res) => {
    db.City.findById(req.params.id, (err, city) =>{
        if(err) return console.log(err);
        res.render('cities/show', {city})
    });
});



module.exports = router;