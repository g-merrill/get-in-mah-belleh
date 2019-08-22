const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersCtrl = require('../controllers/users');


/* GET users listing. */
router.get('/profile', usersCtrl.index);

// // OAuth logout route that redirects to current page
// router.get('/profile/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });

module.exports = router;
