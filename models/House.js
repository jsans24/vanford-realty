const mongoose = require('mongoose');
const houseSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    bedrooms: Number,
    bathrooms: Number,
    size: Number,
    realtor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Realtor'
    },
    img: String
});

const House = mongoose.model('House', houseSchema);

module.exports = House;