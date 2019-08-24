const Truck = require('../../models/truck');


module.exports = {
    index,
    create
};

function index(req, res) {
    Truck.find({})
    .then(trucks => res.status(200).json(trucks))
    .catch(err => res.status(500).json(err));
}

function create(req, res) {
    Truck.create(req.body)
    .then(truck => truck.save())
    .then(truck => res.status(201).json(truck))
    .catch(err => res.status(500).json(err));
}
