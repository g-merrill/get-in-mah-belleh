const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // shortname: function that returns Greg M instead of Greg Merrill
    email: {
        type: String,
        required: true
    },
    password: String,
    googleId: Number,
    trucks: [{
        type: Schema.Types.ObjectId,
        ref: 'Truck'
    }],
    favTrucks: [{
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