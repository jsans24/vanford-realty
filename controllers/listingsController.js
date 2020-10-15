const express = require('express');
const router = express.Router();
const db = require('../models');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {ensureAuthenticated} = require('../config/auth')

//multer middleware
//https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
  },
});

const upload = multer({storage: storage}).single('img');


//index route - Complete
router.get('/', ensureAuthenticated, (req, res) => {
  db.House.find({}, (err, houseListings) => {
    if(err) return console.log(err);

    db.Realtor.find({}, (err, realtors) => {
      if(err) return console.log(err);

      db.City.find({}, (err, allCities) => {
        if(err) return console.log(err);
        res.render('listings/index', {
          listings: houseListings,
          realtors: realtors,
          user: req.user,
          cities: allCities
        });
      });
    });
  });
});

//create route - get - Complete
router.get('/new', (req, res) => {
  db.Realtor.find({}, (err, realtors) => {
    if(err) return console.log(err);
    db.City.find({}, (err, allCities) => {
      if (err) console.log(err);
      res.render('listings/new', {
        realtors: realtors,
        cities: allCities,
        user: req.user,
      });
    });
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
      realtor: req.body.realtor,
      about: req.body.about,
      img: req.file.filename,
    };

    db.House.create(obj, (err, newListing) => {
      if(err) return console.log(err);

      db.Realtor.findById(req.body.realtor, (err, realtor) => {
        if(err) return console.log(err);

        realtor.houses.push(newListing._id);
        realtor.save((err, houseListings) => {
          if(err) return console.log(err);
          res.redirect('/listings');
        });
      });
    });
  })
});


//delete route - Complete
router.delete('/:id', (req, res) => {
  const listingId = req.params.id;

  db.House.findByIdAndDelete(listingId, (err, listingToDelete) => {
    if(err) return console.log(err);

    db.Realtor.findOne({'houses': listingId}, (err, realtor) => {
      if(err) return console.log(err);

      realtor.houses.remove(listingId);
      realtor.save((err) => {
        if(err) return console.log(err);
        res.redirect('/listings');
      });
    });
  });
});

//edit page - get - Complete
router.get('/:id/edit', (req, res) => {
  db.House.findById(req.params.id, (err, listingForEdit) =>{
    if(err) return console.log(err);
    db.Realtor.find({}, (err, allRealtors) => {
      if (err) console.log(err);

      db.City.find({}, (err, allCities) => {
        if (err) console.log(err);

        res.render('listings/edit', {
          listing: listingForEdit,
          realtors: allRealtors,
          user: req.user,
          cities: allCities,
        });
      });
    });
  });
});

//put route - Complete
router.put('/:id', (req, res) => {
  db.Realtor.findOne({houses: req.params.id}, (err, realtor) => {
    if(err) return console.log(err);

    realtor.houses.remove(req.params.id);
    realtor.save((err) => {
      if(err) return console.log(err);
    });

    db.House.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true},
    (err, editedListing) => {
      if(err) return console.log(err);

      db.Realtor.findById(req.body.realtor, (err, realtor) => {
        if(err) return console.log(err);

        realtor.houses.push(req.params.id);
        realtor.save((err) => {
          if(err) return console.log(err);
          res.redirect('/listings')
        });
      });
    });
  });
});

module.exports = router;