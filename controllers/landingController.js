const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', (req, res) => {
    db.House.find({}, (err, houseListing) => {
        if(err) console.log(err)
        const houseArray = [];

        houseListing.forEach(house => {
            houseArray.push(house)
        });
        const randomHouse = houseArray[Math.floor(Math.random() * houseArray.length)];
        
        db.Realtor.find({}, (err, realtorListing) => {
            if(err) console.log(err)
            const realtorArray = [];
        
            realtorListing.forEach(realtor => {
                realtorArray.push(realtor)
            });
            const randomRealtor = realtorArray[Math.floor(Math.random() * realtorArray.length)];
            res.render('index', {
                house: randomHouse,
                realtor: randomRealtor,
                user: req.user,
            })
        })
        

    })
})

module.exports = router;