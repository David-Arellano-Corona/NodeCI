let mongoose = require('mongoose');
let User = mongoose.model('User');

module.exports = () => {
  return new User({}).save();
};
