const express = require('express');
const router = express.Router();
const db = require('../models');
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
  db.City.find({}, (err, cities) => {
  if(err) return console.log(err);
  res.render('cities/index', {cities, user: req.user})
  });
});


//create route - get
router.get('/new', (req, res) => {
  res.render('cities/new')
});

//show route
router.get('/:id', (req, res) => {
  db.City.findById(req.params.id, (err, city) =>{
  if(err) return console.log(err);

  db.House.find({city: city}, (err, localListings) => {
    res.render('cities/show', {city, user: req.user, listings: localListings})
  })
  });
});

//post route
router.post('/', (req, res) => {
  upload(req, res, (err) => {
  if(err) return console.log(err)

  if (req.file) {
    var obj = {
      name: req.body.name,
      population: req.body.population,
      keyAttractions: req.body.keyAttractions,
      houses: req.body.houses,
      bio: req.body.bio,
      img: req.file.filename,
    };
  } else {
    var obj = {
      name: req.body.name,
      population: req.body.population,
      keyAttractions: req.body.keyAttractions,
      houses: req.body.houses,
      bio: req.body.bio,
    };
  }

  db.City.create(obj, (err, newCity) => {
    if(err) return console.log(err);
    res.redirect('/cities');
  });
  })
});

//edit route
router.get('/:id/edit', (req, res) => {
  db.City.findById(req.params.id, (err, cityToEdit) => {
  if (err) console.log(err);
  res.render('cities/edit', {
    cityToEdit,
    user: req.user,
  });
  });
});

//put route
router.put('/:id', (req, res) => {
  upload(req, res, (err) => {
    let obj = '';
    if (err) return console.log(err);

    if (req.file) {
      obj = {
        name: req.body.name,
        population: req.body.population,
        houses: req.body.houses,
        bio: req.body.bio,
        img: req.file.filename,
      };
    } else {
      obj = {
        name: req.body.name,
        population: req.body.population,
        houses: req.body.houses,
        bio: req.body.bio,
      };
    };

    db.City.findByIdAndUpdate(
    req.params.id,
    {$pull: {keyAttractions: req.body.keyAttractionsToDelete},},
    {new: true},
    (err, updatedCity) => {
      if (err) console.log(err);

      db.City.findByIdAndUpdate(
      req.params.id,
      {$push: {keyAttractions: req.body.keyAttractions},},
      {new: true},
      (err, updatedCity) => {
        if (err) console.log(err);

          db.City.findByIdAndUpdate(
            req.params.id,
            obj,
            {new: true},
            (err, updatedCity) => {
            if (err) console.log(err);

            res.redirect(`/cities/${updatedCity._id}`);
          });
      });
    });
  });
});

// delete route
router.delete('/:id', (req, res) => {
  db.City.findByIdAndDelete(req.params.id, (err, listingToDelete) => {
  if(err) return console.log(err);

    db.House.deleteMany({city: req.params.id}, (err, houses) => {
      if(err) return console.log(err);

      res.redirect('/listings');
    });
  });
});

module.exports = router;

