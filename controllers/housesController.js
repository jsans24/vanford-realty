const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../models');
const multer = require('multer');

//multer middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
    }
});

const upload = multer({storage: storage}).single('img');

//index route - Complete
router.get('/', (req, res) => {
    db.House.find({}, (err, houseListings) => {
        if(err) return console.log(err);
        res.render('houses/index', {listings: houseListings})
    });
});

//create route - get - Complete
router.get('/new', (req, res) => {
    db.Realtor.find({}, (err, realtors) => {
        if(err) return console.log(err);
        res.render('houses/new', {realtors, realtors});
    })
});


//show route - 
router.get('/:id', (req, res) => {
    db.House.findById(req.params.id, (err, listing) =>{
        if(err) return console.log(err);
        res.render('houses/show', {listing, listing})
    });
});


//post route - Complete
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if(err) return console.log(err)

        const obj = {
            address: req.body.address,
            city: req.body.city,
            price: req.body.price,
            bedrooms: req.body.bedrooms,
            bathrooms: req.body.bathrooms,
            size: req.body.size,
            type: req.body.type,
            img: req.file.filename
            };

        db.House.create(obj, (err, newListing) => {
            if(err) return console.log(err);
    
            db.Realtor.findById(req.body.realtor, (err, realtor) => {
                if(err) return console.log(err);
    
                realtor.houses.push(newListing._id);
                realtor.save((err, houseListings) => {
                    if(err) return console.log(err);
                    res.redirect('/houses');
                });
            });
        });
    })
});

//delete route
router.delete('/:id', (err, listingToEdit) => {
    const listingId = req.params.id;
    
    db.House.findByIdAndDelete(listingId, (err, listingToDelete) => {
        if(err) return console.log(err);

        db.Realtor.findOne({'houses': listingId}, (err, realtor) => {
            if(err) return console.log(err);

            realtor.houses.remove(listingId);
            realtor.save((err) => {
                if(err) return console.log(err);
                res.redirect('/houses');
            });
        });
    });
});


//edit page - get
router.get('/:id/edit', (req, res) => {
    db.House.findById(req.params.id, (err, listingForEdit) =>{
        if(err) return console.log(err);
        res.render('houses/edit', {listing: listingForEdit})
    });
});

//put route
router.put('/:id', (req, res) => {
    db.House.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true},
        (err, editedListing) => {
            if(err) return console.log(err);
            res.redirect(`/houses/${editedListing._id}`)
        });
});


module.exports = router;