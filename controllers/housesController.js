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

//show route - Complete
router.get('/:id', (req, res) => {
    db.House.findById(req.params.id, (err, listing) =>{
        if(err) return console.log(err);
        res.render('houses/show', {listing, listing})
    });
});



module.exports = router;