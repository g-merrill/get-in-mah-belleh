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
    favTruckIndex,
    favTruckDelIndex,
    favTruckShow,
    favTruckDelShow,
    favTruckSubmitted,
    favTruckDelSubmitted,
    favTruckFavs,
    favTruckDelFavs,
    consoleLogAllData,
    clearThemAll,
    bigSeed,
    littleSeed
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
    let trucks = [];
    let avgRatings = [];
    if (req.user) {
        User.findById(req.user.id)
        .populate('favTrucks')
        .then(user => {
            if (user.favTrucks.length) {
                for(let i = 0; i < user.favTrucks.length; i++) {
                    Truck.findById(user.favTrucks[i].id)
                    .populate('reviews')
                    .then(truck => {
                        console.log('fav-truck: ', truck);
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
                        trucks.push(truck);
                        if (trucks.length === user.favTrucks.length) {
                            res.render('favtrucks/index', {
                                user,
                                viewName: 'favtrucks-index',
                                trucks,
                                avgRatings,
                                pathEndpoint: 'favs'
                            });
                        }
                    })
                    .catch(err => {
                        if (err) console.log(err);
                        res.redirect('/trucks');
                    });
                }
            } else {
                res.render('favtrucks/index', {
                    user,
                    viewName: 'favtrucks-index',
                    trucks,
                    avgRatings,
                    pathEndpoint: 'favs'
                });
            }
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/trucks');
        });
    } else {
        res.render('favtrucks/index', {
            user: undefined,
            viewName: 'favtrucks-index',
            trucks,
            avgRatings,
            pathEndpoint: 'favs'
        });
    }
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
        User.findById(req.user.id)
        .populate('favTrucks')
        .then(user => {
            res.render('users/showtrucks', {
                user,
                viewName: 'users-showtrucks',
                trucks,
                avgRatings,
                pathEndpoint: 'submitted'
            });
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
}

function favTruckIndex(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .then(user => {
            user.favTrucks.push(req.params.truckid)
            return user.save();
        })
        .then(() => res.redirect('/trucks'))
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/trucks');
        });
    } else {
        res.redirect('/trucks');
    }
}

function favTruckDelIndex(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .then(user => {
            let favSpliceIdx = user.favTrucks.findIndex(favTruck => favTruck.toString() === req.params.truckid);
            user.favTrucks.splice(favSpliceIdx, 1);
            return user.save();
        })
        .then(() => res.redirect('/trucks'))
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/trucks');
        });
    } else {
        res.redirect('/trucks');
    }
}

function favTruckShow(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .then(user => {
            user.favTrucks.push(req.params.truckid)
            return user.save();
        })
        .then(() => res.redirect(`/trucks/${req.params.truckid}`))
        .catch(err => {
            if (err) console.log(err);
            res.redirect(`/trucks/${req.params.truckid}`);
        });
    } else {
        res.redirect(`/trucks/${req.params.truckid}`);
    }
}

function favTruckDelShow(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .then(user => {
            let favSpliceIdx = user.favTrucks.findIndex(favTruck => favTruck.toString() === req.params.truckid);
            user.favTrucks.splice(favSpliceIdx, 1);
            return user.save();
        })
        .then(() => res.redirect(`/trucks/${req.params.truckid}`))
        .catch(err => {
            if (err) console.log(err);
            res.redirect(`/trucks/${req.params.truckid}`);
        });
    } else {
        res.redirect(`/trucks/${req.params.truckid}`);
    }
}

function favTruckSubmitted(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .then(user => {
            user.favTrucks.push(req.params.truckid)
            return user.save();
        })
        .then(() => res.redirect('/users/profile/trucks/submitted'))
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/users/profile/trucks/submitted');
        });
    } else {
        res.redirect('/users/profile/trucks/submitted');
    }
}

function favTruckDelSubmitted(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .then(user => {
            let favSpliceIdx = user.favTrucks.findIndex(favTruck => favTruck.toString() === req.params.truckid);
            user.favTrucks.splice(favSpliceIdx, 1);
            return user.save();
        })
        .then(() => res.redirect('/users/profile/trucks/submitted'))
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/users/profile/trucks/submitted');
        });
    } else {
        res.redirect('/users/profile/trucks/submitted');
    }
}

function favTruckFavs(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .then(user => {
            user.favTrucks.push(req.params.truckid)
            return user.save();
        })
        .then(() => res.redirect('/users/profile/trucks/favorites'))
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/users/profile/trucks/favorites');
        });
    } else {
        res.redirect('/users/profile/trucks/favorites');
    }
}

function favTruckDelFavs(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .then(user => {
            let favSpliceIdx = user.favTrucks.findIndex(favTruck => favTruck.toString() === req.params.truckid);
            user.favTrucks.splice(favSpliceIdx, 1);
            return user.save();
        })
        .then(() => res.redirect('/users/profile/trucks/favorites'))
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/users/profile/trucks/favorites');
        });
    } else {
        res.redirect('/users/profile/trucks/favorites');
    }
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
        user.favTrucks = [];
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

function bigSeed(req, res) {
    if(req.user) {
        const seedDataArray = require('../config/seedDataArray');
        const seedFile = require('../config/seed');
        seedFile.bigSeed(req, res, seedDataArray);
    } else {
        res.redirect('/users/profile');
    }
}

function littleSeed(req, res) {
    if(req.user) {
        const seedDataArray = [
            [{
                applicant: "Senor Sisig",
                fooditems: "Filipino fusion food"
            },
            {
                rating: 4,
                content: "Straight up one of the best burritos I've ever had. These guys were at Off the Grid Fort Mason and I had to see what the hype was about. California burrito. Chicken. French fries. Sour cream. Guac. Salsa. Etc. Phenomenal ratio and mix of all the ingredients."
            }],
            [{
                applicant: "Curry Up Now",
                fooditems: "Chicken Tiki Masala Burritos: Paneer Tiki Masala Burritos: Samosas: Mango Lassi"
            },
            {
                rating: 4,
                content: "I got the samosas, my boo got death by Tikka masala. Both were excellent choices. The Mexican Coke is a little overpriced, but my tongue is still dancing from the flavors of the food. Fast service. Also, seriously, the lamb samosas are so good"
            }]
        ];
        const seedFile = require('../config/seed');
        seedFile.littleSeed(req, res, seedDataArray);
    } else {
        res.redirect('/users/profile');
    }
}