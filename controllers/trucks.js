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
        res.send('Error setting up page');
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
        console.log(user);
        return user.save();
    })
    .then(() => res.redirect('/'))
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/new');
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
        res.redirect('/');
    });
}

function deleteTruck(req, res) {
    Truck.findByIdAndDelete(req.params.id)
    .then(truck => {
        // delete from user's truck array
        // ****************
        User.findById(req.user.id)
        .then(user => {
            let idx = user.trucks.findIndex(idx => idx === truck.id);
            user.trucks.splice(idx, 1);
            return user.save();
        })
        .then(() => res.redirect('/'))
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/');
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
        // ****************
}