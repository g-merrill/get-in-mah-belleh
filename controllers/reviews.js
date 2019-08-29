const Review = require('../models/review');
const Truck = require('../models/truck');
const User = require('../models/user');

module.exports = {
    new: newReview,
    create,
    edit,
    delete: deleteReview
};

function newReview(req, res) {
    Truck.findById(req.params.truckid)
    .then(truck => {
        res.render('reviews/new', {
            user: req.user,
            viewName: 'reviews-new',
            truck
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('trucks/show');
    });
}

function create(req, res) {
    if (req.user) {
        req.body.rating = parseInt(req.body.rating);
        Review.create(req.body)
        .then(review => review.save())
        .then(review => {
            User.findById(req.user.id)
            .then(user => {
                user.reviews.push(review.id);
                return user.save();
            })
            .then(user => {
                return Truck.findById(review.truck);
            })
            .then(truck => {
                truck.reviews.push(review.id);
                return truck.save();
            })
            .then(truck => {
                res.redirect(`/trucks/${truck.id}`);
            })
            .catch(err => {
                if (err) console.log(err);
                res.redirect(`/trucks/${req.body.truck}`);
            });
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect(`/trucks/${req.params.truckid}`);
        });
    } else {
        res.redirect('/users/profile');
    }
}

function edit(req, res) {
    if (req.user) {
        Review.findByIdAndUpdate(req.params.reviewid, req.body)
        .then(review => {
            res.redirect('/users/profile/reviews/submitted');
        })
    } else {
        res.redirect('/users/profile/reviews/submitted');
    }
}

function deleteReview(req, res) {
    if (req.user) {
        Review.findByIdAndDelete(req.params.reviewid)
        .then(review => {
            User.findById(review.reviewer)
            .then(user => {
                let spliceIdx = user.reviews.findIndex(userReview => userReview.toString() === review.id);
                user.reviews.splice(spliceIdx, 1);
                return user.save();
            })
            .then(user => {
                return Truck.findById(review.truck);
            })
            .then(truck => {
                let spliceIdx = truck.reviews.findIndex(truckReview => truckReview.id === review.id);
                truck.reviews.splice(spliceIdx, 1);
                return truck.save();
            })
            .then(truck => {
                res.redirect('/users/profile/reviews/submitted');
            })
            .catch(err => {
                if (err) console.log(err);
                res.redirect('/users/profile/reviews/submitted');
            });
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/users/profile/reviews/submitted');
        });
    } else {
        res.redirect('/users/profile/reviews/submitted');
    }
}