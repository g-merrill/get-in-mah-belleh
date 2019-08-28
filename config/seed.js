module.exports = {
    runSeedFunction
};

function runSeedFunction(req, res, array) {
    console.log('******************* SEED DATA FUNCTION START ******************');
    const User = require('../models/user');
    const Truck = require('../models/truck');
    const Review = require('../models/review');
    User.findById(req.user.id)
    .then(user => {
        user.trucks = [];
        user.reviews = [];
        return user.save();
    })
    .then(user => User.deleteMany({ _id: { $ne: user.id } }))
    .then(() => Truck.deleteMany({}))
    .then(() => Review.deleteMany({}))
    .then(() => {
        for (let i = 0; i < array.length; i++) {
            let truckCopy, reviewCopy;
            let truckRaw = array[i][0];
            truckRaw.creator = req.user.id;
            Truck.create(truckRaw)
            .then(createdTruck1 => createdTruck1.save())
            .then(savedTruck1 => {
                truckCopy = savedTruck1;
                return User.findById(truckCopy.creator);
            })
            .then(user => {
                user.trucks.push(truckCopy.id);
                return user.save();
            })
            .then(() => {
                let reviewRaw = array[i][1];
                reviewRaw.reviewer = req.user.id;
                reviewRaw.truck = truckCopy.id;
                return Review.create(reviewRaw);
            })
            .then(createdReview1 => createdReview1.save())
            .then(savedReview1 => {
                reviewCopy = savedReview1;
                return Truck.findById(reviewCopy.truck);
            })
            .then(truck => {
                truck.reviews.push(reviewCopy.id);
                return truck.save();
            })
            .then(truck => {
                truckCopy = truck;
                return User.findById(reviewCopy.reviewer);
            })
            .then(user => {
                user.reviews.push(reviewCopy.id);
                return user.save();
            })
            .then(updatedUser => {
                if (i === array.length - 1) {
                    console.log('Updated User : ', updatedUser);
                    console.log('******************* SEED DATA FUNCTION END ******************');
                    res.redirect('/users/profile'); // put this at the end of the last function!            
                }
            })
            .catch(err => {
                if (err) console.log('Error: ', err);
                res.redirect('/users/profile');
            });
        }
    })
    .catch(err => {
        if (err) console.log('Error: ', err);
        res.redirect('/users/profile');
    });
}
