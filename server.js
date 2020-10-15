// ----- CONFIGURATION ----- //
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
require('dotenv').config();

// ----- PASSPORT CONFIG ----- //
require('./config/passport')(passport);

const PORT = process.env.PORT || 4000;

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
app.use((req,res,next) => {
  res.locals.currentUser = req.user;
  next();
});

//----- EXPRESS SESSION (every user of your API or website will be assigned a unique 
//session, and this allows you to store the user state) ----- //
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// ------ PASSPORT ----- //
app.use(passport.initialize());
app.use(passport.session());

// ----- CONNECT FLASH (typically used in combination with redirects, 
// ensuring that the message is available to the next page that is to be rendered)----- //
app.use(flash());

// ------ GLOBAL VARIABLES ----- //
app.use((req,res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  next();
})

// ----- ROUTES ----- //  

app.get('/contact', (req, res) => res.render('contact'));

app.use('/', ctrl.landing);
app.use('/register', ctrl.register);
app.use('/login', ctrl.login);
app.use('/logout', ctrl.logout);
app.use('/realtors', ctrl.realtors);
app.use('/houses', ctrl.houses);
app.use('/listings', ctrl.listings);
app.use('/cities', ctrl.cities);
app.use('/blogs', ctrl.blogs);

app.use('*', (req, res) => res.render('404'));

// ----- LISTENER ----- //
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));