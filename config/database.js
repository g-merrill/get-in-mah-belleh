const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/puppies', {
    useNewUrlParser: true,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
});



// Do this when you learn MongoDB Atlas

// var mongoose = require('mongoose');

// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

// // database connection event
// mongoose.connection.on('connected', function () {
//   console.log(`Mongoose connected to: ${process.env.DATABASE_URL}`);
// });

// module.exports = mongoose;