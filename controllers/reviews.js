const Review = require('../models/review');
const Truck = require('../models/truck');

module.exports = {
    new: newReview
};

function newReview(req, res) {
    Truck.findById(req.params.id)
    .then(truck => {
        res.render('reviews/new', {
            user: req.user,
            viewName: 'reviews#new',
            truck
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('trucks/show');
    });
}