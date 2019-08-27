const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_DB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true
  // useFindAndModify: false
});
