const mongoose = require('mongoose');

const realtorSchema = new mongoose.Schema({
  name: {
  type: String,
  required: true,
  },
  phone: Number,
  email: String,
  bio: {
    type: String,
    minlength: 20,
  },
  address: String,
  houses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
  }],
  img: String
});

const Realtor = mongoose.model('Realtor', realtorSchema);

module.exports = Realtor;
