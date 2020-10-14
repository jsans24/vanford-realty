const express = require('express');
const router = express.Router();
const db = require('../models');

//index route - Complete
router.get('/', (req, res) => {
    db.House.find({}, (err, houseListings) => {
        if(err) return console.log(err);
        res.render('houses/index', {listings: houseListings,
            user: req.user,})
    });
});

router.get('/search', (req, res) => {
    db.House.find({}, (err, allHouses) => {
        if (err) console.log(err);

        res.render('houses/search', {listings: allHouses,
            user: req.user,});
    });
});

//show route - Complete
router.get('/:id', (req, res) => {
    db.House.findById(req.params.id, (err, listing) => {
        if(err) return console.log(err);

        db.Realtor.findById(req.params.realtor, (err, realtor) => {
            if(err) return console.log(err);

            res.render('houses/show', {
                listing: listing,
                user: req.user,
                realtor
            })
        })

        
    });
});

module.exports = router;