const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const config = require('../config/config');
mongoose.set('debug', true);


function connectToDatabase() {
  // connect to our database
  mongoose.connect(config.databaseUrl, {
    autoIndex: false,
    useNewUrlParser: true
  }).then((result) => {
    console.log(`${config.appName} successfully connected to database.`);
  }).catch((err) => {
    console.log(err);
    process.exit(1);
  });
}

mongoosePaginate.paginate.options = {
  lean: true,
  limit: 20,
  leanWithId: true
};

module.exports = {
  connectToDatabase
};
