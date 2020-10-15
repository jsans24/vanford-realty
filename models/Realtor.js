const mongoose = require('mongoose');

const realtorSchema = new mongoose.Schema({
  name: {
  type: String,
  required: true,
  },
  phone: Number,
  email: {
  type: String,
  required: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
  },
  address: String,
  img: String,
  houses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
  }],
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  }],
  img: String
});

const Realtor = mongoose.model('Realtor', realtorSchema);

module.exports = Realtor;
