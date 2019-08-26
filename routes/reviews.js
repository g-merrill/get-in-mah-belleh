const express = require('express');
const router = express.Router();
const reviewsCtrl = require('../controllers/reviews');

// /* GET reviews homepage. */
// router.get('/', reviewsCtrl.index);
router.get('/users/profile/trucks/:truckid/reviews/new', reviewsCtrl.new);
// router.get('/:id', reviewsCtrl.show);
router.post('/users/profile/trucks/:truckid/reviews', reviewsCtrl.create);
router.put('/users/profile/trucks/:truckid/reviews/:reviewid', reviewsCtrl.edit)
router.delete('/users/profile/trucks/:truckid/reviews/:reviewid', reviewsCtrl.delete);

module.exports = router;
