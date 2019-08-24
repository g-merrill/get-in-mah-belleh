const express = require('express');
const router = express.Router();
const reviewsCtrl = require('../controllers/reviews');

// /* GET reviews homepage. */
// router.get('/', reviewsCtrl.index);
router.get('/users/profile/trucks/:id/reviews/new', reviewsCtrl.new);
// router.get('/:id', reviewsCtrl.show);
router.post('/trucks/:id/reviews', reviewsCtrl.create);
// router.put('/:id', reviewsCtrl.edit)
// router.delete('/:id', reviewsCtrl.delete);

module.exports = router;
