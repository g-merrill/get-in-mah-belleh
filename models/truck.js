const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const truckSchema = new Schema({
    applicant: {
        type: String,
        required: true
    },
    fooditems: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    facilitytype: String,
    locationdescription: String,
    address: String,
    latitude: Number,
    longitude: Number
}, {
    timestamps: true
});


module.exports = mongoose.model('Truck', truckSchema);