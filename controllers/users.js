const User = require('../models/user');
const Truck = require('../models/truck');

module.exports = {
    show,
    editTrucksPage,
    clearThemAll
}

function show(req, res) {
    if (req.user) {
        User.findById(req.user.id)
        .populate('trucks')
        .populate('reviews')
        .then(user => {
            console.log(user);
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

function clearThemAll(req, res) {
    User.findById(req.user.id)
    .then(user => {
        user.trucks = [];
        return user.save();
    })
    .then(() => res.redirect('/users/profile'))
    .catch(err => {
        if (err) console.log(err);
        return res.send('Error with clearing trucks from array');
    });
}