const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://parkerrappleye1:Parker4780@book-search.ppokqij.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

module.exports = mongoose.connection;
