const User = require('../models/user');
const Truck = require('../models/truck');
const Review = require('../models/review');

module.exports = {
    index,
    new: newTruck,
    show,
    create,
    edit,
    delete: deleteTruck
};

function index(req, res) {
    Truck.find({})
    .populate('reviews')
    .then(trucks => {
        let avgRatings = [];
        trucks.forEach(truck => {
            let truckRatingsSum = 0;
            if (truck.reviews.length) {
                truck.reviews.forEach(review => {
                    truckRatingsSum += review.rating;
                });
                let truckAvgRating = Math.round(truckRatingsSum / truck.reviews.length);
                avgRatings.push(truckAvgRating);
            } else {
                avgRatings.push(0);
            }
        });
        res.render('trucks/index', {
            user: req.user,
            viewName: 'trucks-index',
            trucks,
            avgRatings
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.send('Error setting up trucks index page');
    });
}

function newTruck(req, res) {
    res.render('trucks/new', {
        user: req.user,
        viewName: 'trucks-new'
    });
}


function show(req, res) {
    Truck.findById(req.params.truckid)
    .populate('reviews')
    .then(truck => {
        let user = req.user;
        let hasReviewed = user ? truck.reviews.some(review => user.reviews.includes(review.id)) : false;
        let reviewId;
        if (hasReviewed) {
            reviewId = truck.reviews.find(review => user.reviews.includes(review.id)).id;
        }
        let truckAvgRating;
        if (truck.reviews.length) {
            let truckRatingsSum = 0;
            truck.reviews.forEach(review => {
                truckRatingsSum += review.rating;
            });
            truckAvgRating = Math.round(truckRatingsSum / truck.reviews.length);
        } else {
            truckAvgRating = 0;
        }
        Review.find({ truck: truck.id })
        .populate('reviewer')
        .then(reviews => {
            res.render('trucks/show', {
                user,
                viewName: 'trucks-show',
                truck,
                hasReviewed,
                reviewId,
                reviews,
                truckAvgRating
            });
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/trucks');
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/trucks');
    });
}



function create(req, res) {
    if (req.user) {
        let truckObj;
        Truck.create(req.body)
        .then(truck => truck.save())
        .then(truck => {
            truckObj = truck;
            User.findById(truck.creator)
            .then(user => {
                user.trucks.push(truck._id);
                return user.save();
            })
            .then(user => {
                res.render('trucks/show', {
                    user,
                    viewName: 'trucks-show',
                    truck: truckObj,
                    hasReviewed: false,
                    reviewId: undefined,
                    reviews: []
                });
            })
            .catch(err => {
                if (err) console.log(err);
                res.redirect('/trucks/new');
            });
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/trucks/new');
        });
    } else {
        res.redirect('/trucks/new');
    }
}

function edit(req, res) {
    if (req.user) {
        Truck.findByIdAndUpdate(req.params.truckid, req.body)
        .then(truck => {
            console.log(req.body);
            res.redirect('/users/profile/trucks/submitted');
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/users/profile/trucks/submitted');
        });
    } else {
        res.redirect(`/users/profile/trucks/${req.params.truckid}/edit`);
    }
}

function deleteTruck(req, res) {
    if (req.user) {
        Truck.findByIdAndDelete(req.params.truckid)
        .then(truck => {
            User.findById(truck.creator)
            .then(user => {
                let trucksSpliceIdx = user.trucks.findIndex(userTruck => userTruck.toString() === truck.id);
                user.trucks.splice(trucksSpliceIdx, 1);
                return user.save();
            })
            .then(() => {
                return Review.find({ truck: truck._id })
            })
            .then(reviews => {
                reviews.forEach(review => {
                    Review.findByIdAndDelete(review.id)
                    .then(deletedReview => {
                        User.findById(deletedReview.reviewer)
                        .then(foundUser => {
                            let reviewsSpliceIdx = foundUser.reviews.findIndex(userReviews => userReviews.toString() === deletedReview.id);
                            foundUser.reviews.splice(reviewsSpliceIdx, 1);
                            return foundUser.save(err => { if (err) console.log('Error: ', err)});
                        })
                        .catch(err => {
                            if (err) console.log(err);
                            res.redirect('/users/profile/trucks/submitted');
                        });
                    })
                    .catch(err => {
                        if (err) console.log(err);
                        res.redirect('/users/profile/trucks/submitted');
                    });
                });
                return Truck.find({});
            })
            .then(() => {
                res.redirect('/users/profile/trucks/submitted');
            })
            .catch(err => {
                if (err) console.log(err);
                res.redirect('/users/profile/trucks/submitted');
            });
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/users/profile/trucks/submitted');
        });
    } else {
        res.redirect('/users/profile/trucks/submitted');
    }
}