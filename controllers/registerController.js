const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');

// ----- REGISTER PAGE ----- //
router.get('/', (req, res) => res.render('register', {user: req.user}));


// ----- REGISTER POST / NEW REALTOR ----- //
router.post('/', (req, res) => {

  const {name, email, password } = req.body;
  let errors = [];

  // ----- CHECK REQUIRED FIELDS ----- //

  if (!name || !email || !password ) {
    errors.push({msg: 'Please fill in all fields'});
  }

  // ------ CHECK PASSWORD LENGTH ----- //
  if(password.length < 6) {
    errors.push({msg: 'Password should be at least 6 characters'});
  }

  if(errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password
    });
  } else {

    //----- CHECK IF EXISTING EMAIL IN DATABASE ----- //

    db.Realtor.findOne({email: email})
      .then(user => {
      if(!user) {
        db.Realtor.create(req.body, (err, newRealtor) => {
          if(err) {return console.log(err)}

          //-----HASH PASSWORD ----- //
          bcrypt.genSalt(10, (err, salt) => {
            if(err) console.log(err)
            bcrypt.hash(newRealtor.password, salt, (err, hash) => {
              if(err) return console.log(err)
              newRealtor.password = hash;

              newRealtor.save()
              .then(user => {
                req.flash('success_msg', `You are now registered and
                can log in`)
                res.redirect('/login')
              })
              .catch(err => console.log(err))
            });
          });
        });
      } else {
        errors.push({msg: 'User already exists'});
          res.render('register', {
            errors,
            name,
            email,
            password
          });
      };
    });
  };
});

module.exports = router;