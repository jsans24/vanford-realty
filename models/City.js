const mongoose = require('mongoose');
const citySchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    keyAttractions: [{
        type: String
    }],
    houses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
    }],
    img: String
})

const City = mongoose.model('City', citySchema);

module.exports = City;