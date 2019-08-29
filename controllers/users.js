const User = require('../models/user');
const Truck = require('../models/truck');
const Review = require('../models/review');

module.exports = {
    logInPage,
    new: newUser,
    show,
    favTrucks,
    editTrucksPage,
    editReviewPage,
    create,
    userReviews,
    userTrucks,
    consoleLogAllData,
    clearThemAll,
    seedData
}

function logInPage(req, res) {
    res.render('users/index', {
        user: undefined,
        viewName: 'users-index'
    });
}

function newUser(req, res) {
    res.render('users/new', {
        user: undefined,
        viewName: 'users-new'
    });
}

function show(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .populate('trucks')
        .populate('reviews')
        .then(user => {
            let avgRatings = [];
            if (user.trucks.length) {
                user.trucks.forEach(truck => {
                    let truckRatingsSum = 0;
                    if (truck.reviews.length) {
                        Truck.findById(truck.id)
                        .populate('reviews')
                        .then(truck => {
                            truck.reviews.forEach(review => {
                                truckRatingsSum += review.rating;
                            });
                            let truckAvgRating = Math.round(truckRatingsSum / truck.reviews.length);
                            avgRatings.push(truckAvgRating);
                        })
                        .catch(err => {
                            if (err) console.log(err);
                            res.redirect('/users/login');
                        });
                    } else {
                        avgRatings.push(0);
                    }
                });
                res.render('users/show', {
                    user,
                    viewName: 'users-show',
                    avgRatings
                });
            } else {
                avgRatings.push(0);
                res.render('users/show', {
                    user,
                    viewName: 'users-show',
                    avgRatings
                });
            }
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/trucks');
        });
    } else {
        res.render('users/show', {
            user: undefined,
            viewName: 'users-show'
        });
    }
}

function favTrucks(req, res) {
    // NEED TO EDIT THIS CODE, THIS IS COPY PASTED FROM TRUCKS INDEX
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
                truckAvgRating = Math.round(truckRatingsSum / truck.reviews.length);
                avgRatings.push(truckAvgRating);
            } else {
                avgRatings.push(0);
            }
        });
        res.render('favtrucks/index', {
            user: req.user,
            viewName: 'favtrucks-index',
            trucks,
            avgRatings
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.send('Error setting up trucks index page');
    });
    // NEED TO EDIT THIS CODE, THIS IS COPY PASTED FROM TRUCKS INDEX
}

function editTrucksPage(req, res) {
    Truck.findById(req.params.truckid)
    .then(truck => res.render('trucks/edit', {
        user: req.user,
        viewName: 'trucks-edit',
        truck
    }))
    .catch(err => {
        if (err) console.log(err);
        res.redirect(`/trucks/${req.params.truckid}`);
    });
}

function editReviewPage(req, res) {
    Truck.findById(req.params.truckid)
    .then(truck => {
        Review.findById(req.params.reviewid)
        .then(review => res.render('reviews/edit', {
            user: req.user,
            viewName: 'reviews-edit',
            truck,
            review
        }))
        .catch(err => {
            if (err) console.log(err);
            res.redirect(`/trucks/${truck.id}`);
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect(`/trucks/${req.params.truckid}`);
    });
}

function create(req, res) {
    User.create(req.body)
    .then(createdUser => createdUser.save())
    .then(savedUser => {
        req.user = savedUser;
        // ^ doesn't seem to work after redirect or render, not sure if req.user can be saved edited
        // ANSWER: You can't.  Req.user is a passport thing.  Also, major security issues that you don't know how to fix.
        return Truck.find({});
    })
    .then(trucks => {
        res.render('/trucks', {
            user: savedUser,
            viewName: 'trucks-index',
            trucks
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/users/login');
    });
}

function userReviews(req, res) {
    Review.find({ reviewer: req.user.id })
    .populate('truck')
    .then(reviews => {
        res.render('users/showreviews', {
            user: req.user,
            viewName: 'users-showreviews',
            reviews
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/users/profile');
    });
}


function userTrucks(req, res) {
    Truck.find({ creator: req.user.id })
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
        res.render('users/showtrucks', {
            user: req.user,
            viewName: 'users-showtrucks',
            trucks,
            avgRatings
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/users/profile');
    });
}

function consoleLogAllData(req, res) {
    User.find({})
    .then(users => {
        console.log('///////////////////// USERS ///////////////////////////');
        console.log(users);
        return Truck.find({});
    })
    .then(trucks => {
        console.log('///////////////////// TRUCKS ///////////////////////////');
        console.log(trucks);
        return Review.find({});
    })
    .then(reviews => {
        console.log('///////////////////// REVIEWS ///////////////////////////');
        console.log(reviews);
        res.redirect('/users/profile');
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/users/profile');
    })
}

function clearThemAll(req, res) {
    if (req.user) {
    User.findById(req.user.id)
    .then(user => {
        user.trucks = [];
        user.reviews = [];
        return user.save();
    })
    .then(() => Truck.deleteMany({}))
    .then(() => Review.deleteMany({}))
    .then(() => res.redirect('/users/profile'))
    .catch(err => {
        if (err) console.log(err);
        return res.send('Error with clearing data from user array');
    });
    } else {
        res.redirect('/users/profile');
    }
}

function seedData(req, res) {
    if(req.user) {
        const seedDataArray = [
            [{
                applicant: "Senor Sisig",
                fooditems: "Filipino fusion food"
            },
            {
                rating: 5,
                content: "Highly recommended!"
            }],
            [{
                applicant: "Curry Up Now",
                fooditems: "Chicken Tiki Masala Burritos: Paneer Tiki Masala Burritos: Samosas: Mango Lassi"
            },
            {
                rating: 4,
                content: "Good selection. Can be a little pricey."
            }]
        ];
        const seedFile = require('../config/seed');
        seedFile.runSeedFunction(req, res, seedDataArray);
    } else {
        res.redirect('/users/profile');
    }
}