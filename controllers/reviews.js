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
            console.log('Saved review: ', review);
            User.findById(req.user.id)
            .then(user => {
                user.reviews.push(review.id);
                return user.save();
            })
            .then(user => {
                console.log('Updated user: ', user);
                return Truck.findById(review.truck);
            })
            .then(truck => {
                truck.reviews.push(review.id);
                return truck.save();
            })
            .then(truck => {
                console.log('Updated truck: ', truck);
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
            console.log('Updated review: ', review);
            res.redirect(`/trucks/${review.truck}`);
        })
    } else {
        res.redirect('/users/profile');
    }
}

function deleteReview(req, res) {
    if (req.user) {
        Review.findByIdAndDelete(req.params.reviewid)
        .then(review => {
            User.findById(review.reviewer)
            .then(user => {
                console.log('old user reviews', user.reviews);
                let spliceIdx = user.reviews.findIndex(userReview => userReview.toString() === review.id);
                console.log('spliceIdx: ', spliceIdx);
                user.reviews.splice(spliceIdx, 1);
                return user.save();
            })
            .then(user => {
                console.log('new user reviews', user.reviews);
                return Truck.findById(review.truck);
            })
            .then(truck => {
                console.log('old truck reviews', truck.reviews);
                let spliceIdx = truck.reviews.findIndex(truckReview => truckReview.id === review.id);
                console.log('spliceIdx: ', spliceIdx);
                truck.reviews.splice(spliceIdx, 1);
                return truck.save();
            })
            .then(truck => {
                console.log('new truck reviews', truck.reviews);
                console.log('Deleted Review: ', review);
                res.redirect('/users/profile');
            })
            .catch(err => {
                if (err) console.log(err);
                res.redirect('/users/profile');
            });
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/users/profile');
        });
    } else {
        res.redirect('/users/profile');
    }
}