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
    let split = req.url.split('&')
    let split2 = []
    split.forEach(split =>{split2.push(split.split('='))})
    let min_price = split2[0][1]
    let max_price = split2[1][1];
    let bedrooms = split2[2][1]
    let bathrooms = split2[3][1]

    if (min_price !== NaN) min_price = 0;
    if (isNaN(max_price)) max_price = 999999999999;
    if (bedrooms !== NaN) bedrooms = 0;
    if (bathrooms !== NaN) bathrooms = 0;
    db.House.find({
        price: {
            $gte: min_price,
            $lte: max_price,
        },
        bedrooms: {$gte: bedrooms},
        bathrooms: {$gte: bathrooms},
    }, 
    (err, allHouses) => {
        if (err) console.log(err);
        res.render('houses/search', {listings: allHouses,
            user: req.user,});
    });
});

//show route - Complete
router.get('/:id', (req, res) => {
    db.House.findById(req.params.id, (err, listing) => {
        if(err) return console.log(err);

        

        res.render('houses/show', {
            listing: listing,
            user: req.user,
        })
    });
});





module.exports = router;