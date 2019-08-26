const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');


/* GET user profile listing. */
router.get('/profile', usersCtrl.show);
router.get('/profile/trucks/:id/edit', usersCtrl.editTrucksPage);
router.get('/profile/trucks/:truckid/reviews/:reviewid/edit', usersCtrl.editReviewPage);

// ***************
router.get('/consolelogalldata', usersCtrl.consoleLogAllData);
router.get('/clearuserdata', usersCtrl.clearThemAll);
router.get('/seeddata', usersCtrl.seedData);
// ***************


module.exports = router;
