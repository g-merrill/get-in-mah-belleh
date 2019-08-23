module.exports = {
    new: newTruck,
    create
};

function newTruck(req, res) {
    res.render('new', {
        user: req.user,
        viewName: 'trucks#new'
    });
}

function create(req, res) {
    console.log(req.body);
    res.redirect('/');
}