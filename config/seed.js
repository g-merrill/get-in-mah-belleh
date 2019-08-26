module.exports = {
    runSeedFunction
};

function runSeedFunction(req, res) {
    const User = require('../models/user');
    const Truck = require('../models/truck');
    const Review = require('../models/review');

    let truckOne, reviewOne, truckTwo, reviewTwo;
    const truck1 = {
        creator: req.user.id,
        applicant: "Senor Sisig",
        fooditems: "Filipino fusion food"
    };
    Truck.create(truck1)
    .then(createdTruck1 => createdTruck1.save())
    .then(savedTruck1 => {
        truckOne = savedTruck1;
        return User.findById(savedTruck1.creator);
    })
    .then(user => {
        user.trucks.push(truckOne.id);
        return user.save();
    })
    .then(() => {
        // console.log('truckOne.id: ', truckOne.id, typeof truckOne.id);
        const truck1review = {
            reviewer: req.user.id,
            truck: truckOne.id,
            rating: 5,
            content: "Highly recommended!"
        };
        return Review.create(truck1review);
    })
    .then(createdReview1 => createdReview1.save())
    .then(savedReview1 => {
        reviewOne = savedReview1;
        return Truck.findById(reviewOne.truck);
    })
    .then(truck => {
        truck.reviews.push(reviewOne.id);
        return truck.save();
    })
    .then(truck => {
        truckOne = truck;
        return User.findById(reviewOne.reviewer);
    })
    .then(user => {
        user.reviews.push(reviewOne._id);
        return user.save();
    })
    .then(updatedUser => {
        console.log('Updated User: ', updatedUser);
        console.log('******************* SEED DATA FUNCTION END ******************');
        res.redirect('/users/profile'); // put this at the end of the last function!
    })
    .catch(err => {
        if (err) console.log('Error: ', err);
        res.redirect('/users/profile');
    });
}


// has something to do with the user not clearing the truck id properly
// which causes it to not work if you don't clear it out with the other button first




// ADDITIONAL DATA FOR SEEDING BELOW

    
    
    // const truck2 = {
    //     creator: req.user.id,
    //     applicant: "Curry Up Now",
    //     fooditems: "Chicken Tiki Masala Burritos: Paneer Tiki Masala Burritos: Samosas: Mango Lassi"
    // };
    
    // const truck2review = {
    //     reviewer: req.user.id,
    //     truck: truck2.id,
    //     rating: 4,
    //     content: "Good selection. Can be a little pricey."
    // };



    // console.log('******************* GOT TO HERE1 ******************');

    // console.log('******************* GOT TO HERE2 ******************');