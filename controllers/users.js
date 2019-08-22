


module.exports = {
    index
}

function index(req, res) {
    // console.log(req.user);
    res.render('users/index', {
        user: req.user,
        viewName: 'users#index'
    });
}