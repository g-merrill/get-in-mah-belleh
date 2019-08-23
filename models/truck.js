const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const truckSchema = new Schema({
    objectid: Number,
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
    longitude: Number
});


module.exports = mongoose.model('Truck', truckSchema);