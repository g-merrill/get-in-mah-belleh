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
    .then(trucks => {
        res.render('trucks/index', {
            user: req.user,
            viewName: 'trucks-index',
            trucks
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
        console.log('user: ', user, 'truck: ', truck, 'hasReviewed: ', hasReviewed, 'reviewId: ', reviewId);
        Review.find({ truck: truck.id })
        .populate('reviewer')
        .then(reviews => {
            console.log('reviews: ', reviews);
            res.render('trucks/show', {
                user,
                viewName: 'trucks-show',
                truck,
                hasReviewed,
                reviewId,
                reviews
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
            console.log('Saved truck: ', truck);
            truckObj = truck;
            User.findById(truck.creator)
            .then(user => {
                user.trucks.push(truck._id);
                console.log("Updated user's trucks array: ", user);
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
        Truck.findByIdAndUpdate(req.params.truckid, req.body,)
        .then(truck => {
            console.log('Updated truck: ', truck);
            res.redirect(`/trucks/${truck.id}`);
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect(`/trucks/${req.params.truckid}`);
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
                let trucksSpliceIdx = user.trucks.findIndex(userTruck => userTruck._id.toString() === truck.id);
                user.trucks.splice(trucksSpliceIdx, 1);
                let truckReviews = truck.reviews.map(review => review.toString());
                let userReviews = user.reviews.map(review => review.toString());
                let hasReview = userReviews.some(userReview => truckReviews.includes(userReview));
                if (hasReview) {
                    let reviewsSpliceIdx = userReviews.findIndex(userReview => truckReviews.includes(userReview));
                    user.reviews.splice(reviewsSpliceIdx, 1);
                }
                return user.save();
            })
            .then(() => res.redirect('/users/profile'))
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