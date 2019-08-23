const express = require('express');
const router = express.Router();
const passport = require('passport');
const trucksCtrl = require('../controllers/trucks');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    user: req.user,
    viewName: 'trucks#index'
  });
});

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect : '/profile',
    failureRedirect : '/'
  }
));

// OAuth logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/new', trucksCtrl.new);
router.post('/', trucksCtrl.create);

module.exports = router;
