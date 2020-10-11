// ----- CONFIGURATION ----- //
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('dotenv').config();


const PORT = 4000;

app.set('view engine', 'ejs');

// ----- PUBLIC ----- //
app.use( express.static( 'public/uploads' ) );


//----- CONTROLLERS ----- //
const ctrl = require('./controllers');


// ----- MIDDLEWARE ----- //    
app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));

// ----- ROUTES ----- //  
app.get('/', (req, res) => res.render('index'));
app.get('/edit', (req, res) => res.render('edit'));

// app.use('/realtors', ctrl.realtors);
app.use('/houses', ctrl.houses);

app.use('*', (req, res) => res.render('404'));

// ----- LISTENER ----- //
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));