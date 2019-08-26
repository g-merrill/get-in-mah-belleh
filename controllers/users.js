const User = require('../models/user');
const Truck = require('../models/truck');
const Review = require('../models/review');

module.exports = {
    show,
    editTrucksPage,
    consoleLogAllData,
    clearThemAll,
    seedData
}

function show(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .populate('trucks')
        .populate('reviews')
        .then(user => {
            res.render('users/show', {
                user,
                viewName: 'users#show'
            });
        })
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/trucks');
        });
    } else {
        res.render('users/show', {
            user: undefined,
            viewName: 'users#show'
        });
    }
}

function editTrucksPage(req, res) {
    Truck.findById(req.params.id)
    .then(truck => res.render('trucks/edit', {
        user: req.user,
        viewName: 'trucks#edit',
        truck
    }))
    .catch(err => {
        if (err) console.log(err);
        res.redirect(`/trucks/${req.params.id}`);
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