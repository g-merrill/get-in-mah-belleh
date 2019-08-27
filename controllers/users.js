const User = require('../models/user');
const Truck = require('../models/truck');
const Review = require('../models/review');

module.exports = {
    logInPage,
    new: newUser,
    show,
    editTrucksPage,
    editReviewPage,
    create,
    consoleLogAllData,
    clearThemAll,
    seedData
}

function logInPage(req, res) {
    res.render('users/index', {
        viewName: 'users-index'
    });
}

function newUser(req, res) {
    res.render('users/new', {
        viewName: 'users-new'
    });
}

function show(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .populate('trucks')
        .populate('reviews')
        .then(user => {
            res.render('users/show', {
                user,
                viewName: 'users-show'
            });
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
        console.log('Saved user: ', savedUser);
        req.user = savedUser;
        // ^ doesn't seem to work after redirect or render, not sure if req.user can be saved edited
        console.log('req.user: ', req.user);
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