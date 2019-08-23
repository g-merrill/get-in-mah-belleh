const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB at ${process.env.DATABASE_URL}`);
});

module.exports = mongoose;
