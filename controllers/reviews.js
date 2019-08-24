const Review = require('../models/review');
const Truck = require('../models/truck');
const User = require('../models/user');

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
        console.log(review);
        User.findById(req.user.id)
        .then(user => {
            user.reviews.push(review.id);
            return user.save();
        })
        .then(user => {
            console.log(user);
            return Truck.findById(review.truck);
        })
        .then(truck => {
            truck.reviews.push(review.id);
            return truck.save();
        })
        .then(truck => {
            console.log(truck);
            res.redirect(`/trucks/${truck.id}`);
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect(`/trucks/${req.body.truck}`);
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect(`/trucks/${req.body.truck}`);
    });
}