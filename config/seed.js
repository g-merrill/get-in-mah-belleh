module.exports = {
    runSeedFunction
}

function runSeedFunction(req, res){
    const userCtrl = require('../controllers/users');
    const Truck = require('../models/truck');
    const Review = require('../models/review');

    userCtrl.clearThemAll(req, res);

    const truck1 = {
        creator: req.user.id,
        applicant: "Senor Sisig",
        fooditems: "Filipino fusion food"
    };

    let truck1id = [];
    Truck.create(truck1)
    .then(truck => truck.save())
    .then(truck => truck1id.push(truck.id));
    truck1id = truck1id[0];
    console.log('truck1id: ', truck1id);

    const truck2 = {
        creator: req.user.id,
        applicant: "Curry Up Now",
        fooditems: "Chicken Tiki Masala Burritos: Paneer Tiki Masala Burritos: Samosas: Mango Lassi"
    };

    let truck2id = [];
    Truck.create(truck2)
    .then(truck => truck.save())
    .then(truck => truck2id.push(truck.id));
    truck2id = truck2id[0];
    console.log('truck2id: ', truck2id);

    const truck1review = {
        reviewer: req.user.id,
        truck: truck1id,
        rating: 5,
        content: "Highly recommended!"
    };

    Review.create(truck1review)
    .then(truck => truck.save(err => {if(err) console.log(err)}))
    .catch(err => console.log('Error creating truck review 1: ', err));

    const truck2review = {
        reviewer: req.user.id,
        truck: truck2id,
        rating: 4,
        content: "Good selection. A little pricey."
    };

    Review.create(truck2review)
    .then(truck => truck.save(err => {if(err) console.log(err)}))
    .catch(err => console.log('Error creating truck review 2: ', err));
}