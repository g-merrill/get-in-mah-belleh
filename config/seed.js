module.exports = {
    runSeedFunction
}

function runSeedFunction(req, res) {
    const User = require('../models/user');
    const Truck = require('../models/truck');
    const Review = require('../models/review');

    const truck1 = {
        creator: req.user.id,
        applicant: "Senor Sisig",
        fooditems: "Filipino fusion food"
    };
    Truck.create(truck1)
    .then(truck1 => truck1.save())
    .then(truck1 => {
        console.log('Saved truck1: ', truck1);
        const truck1review = {
            reviewer: req.user.id,
            truck: truck1.id,
            rating: 5,
            content: "Highly recommended!"
        };
        return Review.create(truck1review);
    })
    .then(review1 => review1.save())
    .then(review1 => {
        console.log('Saved review1: ', review1);
        User.findById(req.user.id)
        .then(user => {
            user.trucks.push(review1.truck);
            user.reviews.push(review1.id);
            return user.save();
        })
        .then(() => {
            const truck2 = {
                creator: req.user.id,
                applicant: "Curry Up Now",
                fooditems: "Chicken Tiki Masala Burritos: Paneer Tiki Masala Burritos: Samosas: Mango Lassi"
            };
            return Truck.create(truck2);
        })
        .then(truck2 => truck2.save())
        .then(truck2 => {
            const truck2review = {
                reviewer: req.user.id,
                truck: truck2.id,
                rating: 4,
                content: "Good selection. Can be a little pricey."
            };
            return Review.create(truck2review);
        })
        .then(review2 => review2.save())
        .then(review2 => {
            User.findById(req.user.id)
            .then(user => {
                user.trucks.push(review2.truck);
                user.reviews.push(review2.id);
                return user.save();
            })
            .then(() => {
                console.log('******************* SEED DATA FUNCTION END ******************');
                res.redirect('/users/profile');
            })
            .catch(err => console.log('Error with saving user after all finished...: ', err));
        })
        .catch(err => console.log('Error with creating truck 2 and review...: ', err));
    })
    .catch(err => console.log('Error with first part', err));
}


    // console.log('******************* GOT TO HERE1 ******************');

    // console.log('******************* GOT TO HERE2 ******************');