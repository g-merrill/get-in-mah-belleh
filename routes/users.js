const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');

router.get('/users/login', usersCtrl.logInPage);
router.get('/users/new', usersCtrl.new);
/* GET user profile listing. */
router.get('/users/profile', usersCtrl.show);
router.get('/users/profile/trucks/favorites', usersCtrl.favTrucks);
router.get('/users/profile/trucks/:truckid/edit', usersCtrl.editTrucksPage);
router.get('/users/profile/trucks/:truckid/reviews/:reviewid/edit', usersCtrl.editReviewPage);
router.post('/users', usersCtrl.create);

router.get('/users/profile/reviews/submitted', usersCtrl.userReviews);
router.get('/users/profile/trucks/submitted', usersCtrl.userTrucks);

router.post('/trucks/:truckid/favorites/index', usersCtrl.favTruckIndex);
router.post('/trucks/:truckid/favorites/show', usersCtrl.favTruckShow);
router.post('/trucks/:truckid/favorites/submitted', usersCtrl.favTruckSubmitted);
router.delete('/trucks/:truckid/favorites/index', usersCtrl.favTruckDelIndex);
router.delete('/trucks/:truckid/favorites/show', usersCtrl.favTruckDelShow);
router.delete('/trucks/:truckid/favorites/submitted', usersCtrl.favTruckDelSubmitted);

// ***************
router.get('/users/consolelogalldata', usersCtrl.consoleLogAllData);
router.get('/users/clearuserdata', usersCtrl.clearThemAll);
router.get('/users/seeddata', usersCtrl.seedData);
// ***************


module.exports = router;
