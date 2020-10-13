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

router.get('/', (req, res) => {
  db.Realtor.find({}, (err, allRealtors) => {
    if (err) return console.log(err);

    res.render('realtors/index', {allRealtors,
      user: req.user,});
  });
});

router.get('/new', (req, res) => {
  res.render('realtors/new', {user: req.user,})
});

// router.post('/', (req, res) => {
//   db.Realtor.create(req.body, (err, newRealtor) => {
//     if (err) console.log(err);

//     res.redirect('/realtors');
//   });
// });

router.get('/:realtorId', (req, res) => {
  db.Realtor.findById(req.params.realtorId).populate('houses').exec((err, foundRealtor) => {
    if (err) console.log(err);

    console.log(foundRealtor);

    res.render('realtors/show', {
      realtor: foundRealtor,
      houses: foundRealtor.houses,
      user: req.user,
    });
  });
});

router.get('/:realtorId/edit', (req, res) => {
  db.Realtor.findById(req.params.realtorId, (err, foundRealtor) => {
    if (err) console.log(err);

    res.render('realtors/edit', {foundRealtor,
      user: req.user,});
  });
});

router.put('/:realtorId', (req, res) => {
  upload(req, res, (err) => {

    if (err) return console.log(err);

    console.log(req.body);
    
      if (req.file) {
        const obj = {
          address: req.body.address,
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
          bio: req.body.bio,
          img: req.file.filename
        };

        db.Realtor.findByIdAndUpdate(
          req.params.realtorId,
          obj,
          {new: true},
          (err, updatedRealtor) => {
          if (err) console.log(err);
      
          res.redirect(`/realtors/${updatedRealtor._id}`);
        });
      } else {
        db.Realtor.findByIdAndUpdate(
          req.params.realtorId,
          req.body,
          {new: true},
          (err, updatedRealtor) => {
          if (err) console.log(err);
      
          res.redirect(`/realtors/${updatedRealtor._id}`);
        });
      };
  });
});

router.delete('/:realtorId', (req, res) => {
  db.Realtor.findByIdAndDelete(req.params.realtorId, (err, deletedRealtor) => {
    if (err) console.log(err);

    res.redirect('/realtors');
  });
});

module.exports = router;