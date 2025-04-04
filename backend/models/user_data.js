const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  address: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;