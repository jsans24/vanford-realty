// ----- CONFIGURATION ----- //
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// ----- PUBLIC ----- //
app.use( express.static( "public" ) );


//----- CONTROLLERS ----- //
const ctrl = require('./controllers');


// ----- MIDDLEWARE ----- //    
app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({storage: storage});

// ----- ROUTES ----- //  
app.get('/', (req, res) => res.render('index'));

// app.use('/realtors', ctrl.realtors);
app.use('/houses', ctrl.houses);

app.use('*', (req, res) => res.render('404'));

// ----- LISTENER ----- //
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));