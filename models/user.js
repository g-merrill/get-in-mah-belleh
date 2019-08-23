const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    googleId: Number, // is it a string or a number??
    trucks: [{
        type: Schema.Types.ObjectId,
        ref: 'Truck'
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);