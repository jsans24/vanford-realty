const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../models');

//index route
router.get('/', (req, res) => {
    db.House.find({}, (err, houseListings) => {
        if(err) return console.log(err)
        res.render('houses/index', {listings: houseListings})
    })
})

//create route - get
router.get('/new', (req, res) => {
    res.render('houses/new')
});


//show route
router.get('/:id', (req, res) => {
    db.House.findById(req.params.id, (err, listing) =>{
        if(err) console.log(err)
        res.render('houses/show', {listing, listing})
    });
});


//post route
router.post('/', (req, res) => {
    let obj = {
        address: req.body.name,
        city: req.body.city,
        price: req.body.price,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        size: req.body.size,
        type: req.body.type,
        img: { 
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
            contentType: req.body.file
        }
    };
    db.House.create(obj, (err, newListing) => {
        if(err) return console.log(err);
        res.redirect('/listings')
    });
});

//delete route



//edit page - get
router.get('/:id/edit', (req, res) => {
    
})

//put route

module.exports = router;