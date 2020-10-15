const mongoose = require('mongoose');
const citySchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true
  },
  population: Number,
  keyAttractions: [{
    type: String
  }],
  houses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
  }],
  bio: String,
  img: String,
}, {timestamps: true});

const City = mongoose.model('City', citySchema);

module.exports = City;