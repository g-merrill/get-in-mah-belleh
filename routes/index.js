const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', function(req, res) {
    res.redirect('/trucks');
});

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
    'google',
    { scope: ['profile', 'email'] }
));

router.get('/oauth2callback', passport.authenticate(
    'google',
    {
        successRedirect : '/trucks',
        failureRedirect : '/'
    }
));

// OAuth logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;