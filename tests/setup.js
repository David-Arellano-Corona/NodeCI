jest.setTimeout(3000000);

require('../models/User');

let mongoose = require('mongoose');
let keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
