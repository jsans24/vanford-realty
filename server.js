// ----- CONFIGURATION ----- //
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
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

//----- EXPRESS SESSION (every user of your API or website will be assigned a unique 
//session, and this allows you to store the user state) ----- //
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// ----- CONNECT FLASH (typically used in combination with redirects, 
// ensuring that the message is available to the next page that is to be rendered)----- //
app.use(flash());

// ------ GLOBAL VARIABLES ----- //
app.use((req,res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

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