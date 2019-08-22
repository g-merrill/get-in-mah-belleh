const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const truckSchema = new Schema({
    objectid: Number,
    applicant: String,
    facilitytype: String,
    locationdescription: String,
    address: String,
    fooditems: String,
    latitude: Number,
    longitude: Number
});


module.exports = mongoose.model('Truck', truckSchema);