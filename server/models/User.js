const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  pincode: String,
  password: String
});

module.exports = mongoose.model('User', userSchema);
