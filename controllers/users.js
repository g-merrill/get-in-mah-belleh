


module.exports = {
    show
}

function show(req, res) {
    // console.log(req.user);
    res.render('users/show', {
        user: req.user,
        viewName: 'users#show'
    });
}