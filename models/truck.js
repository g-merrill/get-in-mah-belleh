const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const truckSchema = new Schema({
    applicant: {
        type: String,
        required: true
    },
    facilitytype: String,
    locationdescription: String,
    address: String,
    fooditems: {
        type: String,
        required: true
    },
    latitude: Number,
    longitude: Number,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    timestamps: true
});


module.exports = mongoose.model('Truck', truckSchema);