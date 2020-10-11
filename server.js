// ----- CONFIGURATION ----- //
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

const PORT = 4000;

const db = require('./models');
const data = require('./test/realtorTestList')

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
app.get('/', (req, res) => res.render('index'));
app.get('/register', (req, res) => res.render('register'));

//post route realtor register
app.post('/register', (req, res) => {
    db.Realtor.create(req.body, (err, newRealtor) => {
        if(err) return console.log(err)
        res.redirect('/listings/')
    });
});

// //post route realtor login
// app.post('/login', (req, res) => {
    
// });

// db.Realtor.collection.insertMany(data, (err, realtors) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(realtors)
//     }
//     process.exit();
// })

// app.use('/realtors', ctrl.realtors);
app.use('/houses', ctrl.houses);
app.use('/listings', ctrl.listings);

app.use('*', (req, res) => res.render('404'));

// ----- LISTENER ----- //
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));