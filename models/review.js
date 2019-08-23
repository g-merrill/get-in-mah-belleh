const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    truck: {
        type: Schema.Types.ObjectId,
        ref: 'Truck'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    content: String
}, {
    timestamps: true
});


module.exports = mongoose.model('Review', reviewSchema);