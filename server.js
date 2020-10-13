// ----- CONFIGURATION ----- //
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

const PORT = 4000;

const db = require('./models');

app.set('view engine', 'ejs');

// ----- PUBLIC ----- //
app.use(express.static(path.resolve('./public')));
app.use(express.static( 'public/uploads' ) );


//----- CONTROLLERS ----- //
const ctrl = require('./controllers');


// ----- MIDDLEWARE ----- //    
app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));

// ----- ROUTES ----- //  

app.use('/', ctrl.landing);
app.use('/register', ctrl.register);
app.use('/login', ctrl.login);
app.use('/realtors', ctrl.realtors);
app.use('/houses', ctrl.houses);
app.use('/listings', ctrl.listings);

app.use('*', (req, res) => res.render('404'));

// ----- LISTENER ----- //
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));