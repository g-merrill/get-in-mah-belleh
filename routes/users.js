const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersCtrl = require('../controllers/users');


/* GET users listing. */
router.get('/users', usersCtrl.index);

// OAuth logout route that redirects to current page
router.get('/users/logout', (req, res) => {
  req.logout();
  res.redirect('/users');
});

module.exports = router;
