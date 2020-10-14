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
        res.render('cities/index', {cities})
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
        res.render('cities/show', {city})
    });
});

//post route
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if(err) return console.log(err)

        const obj = {
            name: req.body.name,
            population: req.body.population,
            keyAttractions: req.body.keyAttractions,
            houses: req.body.houses,
            bio: req.body.bio,
            img: req.file.filename,
        };

        db.City.create(obj, (err, newCity) => {
            if(err) return console.log(err);

            console.log(newCity);
    
            db.House.find({}, (err, houses) => {
                if(err) return console.log(err);
    
                houses.push(newCity._id);
                houses.save((err, houseListings) => {
                    if(err) return console.log(err);
                    res.redirect('/cities');
                });
            });
        });
    })
});

//edit route
router.get('/:id/edit', (req, res) => {
    db.City.findById(req.params.rid, (err, cityToEdit) => {
        if (err) console.log(err);

        res.render('cities/edit', {cityToEdit,
            user: req.user,});
    });
});

//put route
router.put('/:id', (req, res) => {
    upload(req, res, (err) => {

    if (err) return console.log(err);

    console.log(req.body);
    
        if (req.file) {
        const obj = {
            name: req.body.name,
            population: req.body.population,
            keyAttractions: req.body.keyAttractions,
            houses: req.body.houses,
            bio: req.body.bio,
            img: req.file.filename,
        };

        db.City.findByIdAndUpdate(
            req.params.id,
            obj,
            {new: true},
            (err, updatedCity) => {
            if (err) console.log(err);
        
            res.redirect(`/cities/${updatedCity._id}`);
        });
        } else {
            db.City.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true},
            (err, updatedCity) => {
            if (err) console.log(err);
        
            res.redirect(`/cities/${updatedCity._id}`);
            });
        };
    });
});

module.exports = router;