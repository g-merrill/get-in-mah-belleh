const Truck = require('../../models/truck');


module.exports = {
    index
};

function index(req, res) {
    Truck.find({})
    .then(trucks => {
        res.status(200).json(trucks);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}