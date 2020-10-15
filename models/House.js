const mongoose = require('mongoose');
const houseSchema = new mongoose.Schema({
  address: {
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
  about: String,
  realtor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Realtor'
  },
  img: String,
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  }
}, {timestamps: true});

const House = mongoose.model('House', houseSchema);

module.exports = House;