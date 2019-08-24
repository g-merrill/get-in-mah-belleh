const Review = require('../models/review');
const Truck = require('../models/truck');

module.exports = {
    new: newReview,
    create
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

function create(req, res) {
    req.body.rating = parseInt(req.body.rating);
    Review.create(req.body)
    .then(review => review.save())
    .then(review => {
        // res.redirect(`/trucks/${req.body.truck}`);
        console.log(review);
        res.redirect(`/trucks/${review.truck}`);
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect(`/trucks/${req.body.truck}`);
    });
}