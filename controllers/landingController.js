const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', (req, res) => {
  db.House.find({}, (err, houseListing) => {
    if(err) return console.log(err);
    const houseArray = [];

    houseListing.forEach(house => {
      houseArray.push(house)
    });
    const randomHouse = houseArray[Math.floor(Math.random() * houseArray.length)];

    db.Realtor.find({}, (err, realtorListing) => {
      if(err) return console.log(err);
      const realtorArray = [];

      realtorListing.forEach(realtor => {
        realtorArray.push(realtor)
      });
      const randomRealtor = realtorArray[Math.floor(Math.random() * realtorArray.length)];



      db.Blog.find({}, (err, blogs) => {
        if(err) return console.log(err);

        db.City.find({}, (err, cities) => {
          if(err) return console.log(err);

          res.render('index', {
            house: randomHouse,
            realtor: randomRealtor,
            user: req.user,
            blogs: blogs,
            cities
          });
        });
      });
    });
  });
});

module.exports = router;