const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersCtrl = require('../controllers/users');


/* GET user profile listing. */
router.get('/profile', usersCtrl.show);


module.exports = router;
