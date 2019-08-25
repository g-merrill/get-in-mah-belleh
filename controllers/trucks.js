const User = require('../models/user');
const Truck = require('../models/truck');

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
        console.log(req.user, trucks);
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
    .populate('reviews')
    .then(truck => {
        let user = req.user;
        let hasReviewed = user ? truck.reviews.some(review => user.reviews.includes(review.id)) : false;
        let reviewIdx;
        if (hasReviewed) {
            reviewIdx = truck.reviews.find(review => user.reviews.includes(review.id)).id;
        }
        console.log('user: ', user, 'truck: ', truck, 'hasReviewed: ', hasReviewed, 'reviewIdx: ', reviewIdx);
        res.render('trucks/show', {
            user,
            viewName: 'trucks#show',
            truck,
            hasReviewed,
            reviewIdx
        });
    })
    .catch(err => {
        if (err) console.log(err);
        res.redirect('/trucks');
    });
}



function create(req, res) {
    if (req.user) {
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
    } else {
        res.redirect('/trucks/new');
    }
}

function edit(req, res) {
    if (req.user) {
        Truck.findByIdAndUpdate(req.params.id, req.body,)
        .then(truck => res.redirect(`/trucks/${truck.id}`))
        .catch(err => {
            if (err) console.log(err);
            res.redirect(`/trucks/${req.params.id}`);
        });
    } else {
        res.redirect(`/users/profile/trucks/${req.params.id}/edit`);
    }
}

function deleteTruck(req, res) {
    if (req.user) {
        Truck.findByIdAndDelete(req.params.id)
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