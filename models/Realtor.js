const mongoose = require('mongoose');
const realtorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    houses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House'
    }]
});

const Realtor = mongoose.model('Realtor', realtorSchema);

module.exports = Realtor;
