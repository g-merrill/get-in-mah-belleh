const Review = require('../models/review');
const Truck = require('../models/truck');
const User = require('../models/user');

module.exports = {
    new: newReview,
    create,
    delete: deleteReview
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
    // *****************SHOW ALL REVIEWS************************
    // Review.find({})
    // .then(reviews => {
    //     console.log('All reviews in database: ', reviews);
    //     res.redirect(`/trucks/${req.params.id}`);
    // })
    // .catch(err => {
    //     if (err) console.log(err);
    //     res.redirect(`/trucks/${req.params.id}`);
    // });
    // *****************SHOW ALL REVIEWS************************
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

function deleteReview(req, res) {
    // *****************SHOW ALL REVIEWS************************
    // Review.find({})
    // .then(reviews => {
    //     console.log('All reviews in database: ', reviews);
    //     res.redirect(`/trucks/${req.params.truckid}`);
    // })
    // .catch(err => {
    //     if (err) console.log(err);
    //     res.redirect(`/trucks/${req.params.truckid}`);
    // });
    // *****************SHOW ALL REVIEWS************************
    // **********DELETE ALL REVIEWS********************
    // User.findById(req.user.id)
    // .then(user => {
    //     user.reviews = [];
    //     return user.save();
    // })
    // .then(() => Truck.findById(req.params.truckid))
    // .then(truck => {
    //     truck.reviews = [];
    //     return truck.save();
    // })
    // .then(() => {
    //     return Review.deleteMany({});
    // })
    // .then((reviews) => {
    //     console.log(reviews);
    //     res.redirect(`/trucks/${req.params.truckid}`);
    // })
    // .catch(err => {
    //     if (err) console.log(err);
    //     res.redirect(`/trucks/${req.params.truckid}`);
    // });
    // ******************************
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
            res.redirect(`/trucks/${review.truck}`);
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect(`/trucks/${req.params.truckid}`);
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect(`/trucks/${req.params.truckid}`);
    });
}