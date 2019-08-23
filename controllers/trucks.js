const User = require('../models/user');
const Truck = require('../models/truck');

module.exports = {
    index,
    new: newTruck,
    show,
    editPage,
    create,
    edit,
    delete: deleteTruck
};

function index(req, res) {
    Truck.find({})
    .then(trucks => {
        res.render('trucks/index', {
            user: req.user,
            viewName: 'trucks#index',
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
        viewName: 'trucks#new'
    });
}


function show(req, res) {
    Truck.findById(req.params.id)
    .then(truck => {
        res.render('trucks/show', {
            user: req.user,
            viewName: 'trucks#show',
            truck
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/trucks');
    });
}

function editPage(req, res) {
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

function create(req, res) {
    Truck.create(req.body)
    .then(truck => truck.save())
    .then(truck => {
        console.log('Saved truck: ', truck);
        User.findById(truck.creator)
        .then(user => {
            user.trucks.push(truck._id);
            console.log("Updated user's trucks array: ", user);
            return user.save();
        })
        .then(() => res.redirect('/trucks'))
        .catch(err => {
            if (err) console.log(err);
            res.redirect('/trucks/new');
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/trucks/new');
    });
}

function edit(req, res) {
    Truck.findByIdAndUpdate(req.params.id, req.body,)
    .then(truck => res.redirect(`/trucks/${truck.id}`))
    .catch(err => {
        if (err) console.log(err);
        res.redirect(`/trucks/${req.params.id}`);
    });
}

function deleteTruck(req, res) {
    Truck.findByIdAndDelete(req.params.id)
    .then(truck => {
        User.findById(req.user.id)
        .then(user => {
            let idx = user.trucks.findIndex(idx => idx === truck.id);
            user.trucks.splice(idx, 1);
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
}