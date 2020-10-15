const express = require('express');
const router = express.Router();
const db = require('../models')
const fs = require('fs');
const path = require('path');
const multer = require('multer');

//multer middleware
//https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
  }
});

const upload = multer({storage: storage}).single('img');

//index route
router.get('/', (req, res) => {
  db.Realtor.find({}, (err, allRealtors) => {
    if (err) return console.log(err);
  
    res.render('realtors/index', {
      allRealtors,
      user: req.user,
    });
  });
});

//create route
router.get('/new', (req, res) => {
  res.render('realtors/new', {user: req.user,});
});

//show page
router.get('/:realtorId', (req, res) => {
  db.Realtor.findById(req.params.realtorId).populate('houses').exec((err, foundRealtor) => {
  if (err) console.log(err);

    db.City.find({}, (err, cities) => {
      if(err) return console.log(err)
  
      res.render('realtors/show', {
        realtor: foundRealtor,
        houses: foundRealtor.houses,
        user: req.user,
        cities
      });
    })
  });
});

//edit record route
router.get('/:realtorId/edit', (req, res) => {
  db.Realtor.findById(req.params.realtorId, (err, foundRealtor) => {
  if (err) console.log(err);

  res.render('realtors/edit', {foundRealtor,
    user: req.user,});
  });
});

//put route
router.put('/:realtorId', (req, res) => {
  upload(req, res, (err) => {
    let obj = '';
    if (err) return console.log(err);

    if (req.file) {
      obj = {
        address: req.body.address,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        bio: req.body.bio,
        img: req.file.filename
      };
    } else {
      obj = {
        address: req.body.address,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        bio: req.body.bio,
      };
    };
    db.Realtor.findByIdAndUpdate(
      req.params.realtorId,
      obj,
      {new: true},
      (err, updatedRealtor) => {
      if (err) console.log(err);
    
      res.redirect(`/realtors/${req.params.realtorId}`);
      });
  });
});

//delete route
router.delete('/:realtorId', (req, res) => {
  db.Realtor.findByIdAndDelete(req.params.realtorId, (err, deletedRealtor) => {
  if (err) console.log(err);

    db.House.deleteMany({realtor: deletedRealtor._id}, (err, deletedHouses) => {
      if (err) console.log(err);

      db.Blog.deleteMany({author: deletedRealtor._id}, (err, deletedBlogs) => {
        if (err) console.log(err);

        res.redirect('/realtors');
      });
    });
  });
});

module.exports = router;