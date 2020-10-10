const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../models');

//index route

//create route - get
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
            contentType: ''
        }
    }
    db.House.create(req.body, (err, newListing) => {
        if(err) return console.log(err);
        res.redirect('/listings')
    })
})


//show route

//edit page -git

//post route

//delete route

//put route

module.exports = router;