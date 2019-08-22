const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersCtrl = require('../controllers/users');


/* GET users listing. */
router.get('/profile', usersCtrl.index);


module.exports = router;
