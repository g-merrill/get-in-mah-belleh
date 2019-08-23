const express = require('express');
const router = express.Router();
const passport = require('passport');
const trucksCtrl = require('../controllers/trucks');

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect : '/users/profile',
    failureRedirect : '/'
  }
));

// OAuth logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/* GET trucks homepage. */
router.get('/', trucksCtrl.index);
router.get('/new', trucksCtrl.new);
router.post('/', trucksCtrl.create);
router.get('/:id', trucksCtrl.show);
router.delete('/:id', trucksCtrl.delete);

module.exports = router;
