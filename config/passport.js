const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const db = require('../models');
const { Realtor } = require('../models');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            // ----- MATCH USER ----- //
            db.Realtor.findOne({email: email}, (err, user) => {
                if(err) return console.log(err)
                if (!user) {
                    return done(null, false, {message: `That email is not 
                    registered`});
                }
                //----- MATCH PASSWORD ----- //
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) return console.log(err)
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, {message: `Password incorrect`})
                    }
                });
            })
        })
    );
    
}