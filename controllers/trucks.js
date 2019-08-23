const User = require('../models/user');
const Truck = require('../models/truck');

module.exports = {
    index,
    new: newTruck,
    create,
    show,
    delete: deleteTruck
};

function index(req, res) {
    Truck.find({})
    .then(trucks => {
        res.render('index', {
            user: req.user,
            viewName: 'trucks#index',
            trucks
        });
    })
    .catch(err => {
        if (err) console.log(err);
        return res.send('Error setting up page');
    });
}

function newTruck(req, res) {
    res.render('new', {
        user: req.user,
        viewName: 'trucks#new'
    });
}

function create(req, res) {
    console.log(req.body);
    let truckId;
    Truck.create(req.body)
    .then(truck => truck.save())
    .then(truck => {
        truckId = truck._id;
        return User.findById(truck.creator);
    })
    .then(user => {
        user.trucks.push(truckId);
        return user.save();
    })
    .then(() => res.redirect('/'))
    .catch(err => {
        if (err) console.log(err);
        return res.redirect('/new');
    });
}

function show(req, res) {
    Truck.findById(req.params.id)
    .then(truck => {
        res.render('show', {
            user: req.user,
            viewName: 'trucks#show',
            truck
        });
    })
    .catch(err => {
        if (err) console.log(err);
        return res.redirect('/');
    });
}

function deleteTruck(req, res) {
    Truck.findByIdAndDelete(req.params.id)
    .then(() => {
        res.redirect('/');
    })
    .catch(err => {
        if (err) console.log(err);
        return res.redirect('/');
    });
}