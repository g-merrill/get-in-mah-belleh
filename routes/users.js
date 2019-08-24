const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');


/* GET user profile listing. */
router.get('/profile', usersCtrl.show);
router.get('/profile/trucks/:id/edit', usersCtrl.editTrucksPage);

// ***************
router.get('/clearuserstrucksfromarray', usersCtrl.clearThemAll)
// ***************


module.exports = router;
