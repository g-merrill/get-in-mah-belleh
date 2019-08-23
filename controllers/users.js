const User = require('../models/user');


module.exports = {
    show,
    clearThemAll
}

function show(req, res) {
    console.log(req.user);
    if (req.user) {
        User.findById(req.user.id)
        .populate('trucks')
        .then(user => {
            console.log(user);
            res.render('users/show', {
                user,
                viewName: 'users#show'
            });
        })
        .catch(err => {
            if (err) console.log(err);
            return res.send('Error with showing profile page');
        });
    } else {
        res.render('users/show', {
            user: req.user,
            viewName: 'users#show'
        });
    }
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