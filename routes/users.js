const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');



router.get('/login', usersCtrl.logInPage);
router.get('/new', usersCtrl.new);
/* GET user profile listing. */
router.get('/profile', usersCtrl.show);
router.get('/profile/trucks/favorites', usersCtrl.favTrucks);
router.get('/profile/trucks/:truckid/edit', usersCtrl.editTrucksPage);
router.get('/profile/trucks/:truckid/reviews/:reviewid/edit', usersCtrl.editReviewPage);
router.post('/', usersCtrl.create);

// ***************
router.get('/consolelogalldata', usersCtrl.consoleLogAllData);
router.get('/clearuserdata', usersCtrl.clearThemAll);
router.get('/seeddata', usersCtrl.seedData);
// ***************


module.exports = router;
