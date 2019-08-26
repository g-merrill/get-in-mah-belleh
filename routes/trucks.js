const express = require('express');
const router = express.Router();
const trucksCtrl = require('../controllers/trucks');

/* GET trucks homepage. */
router.get('/', trucksCtrl.index);
router.get('/new', trucksCtrl.new);
router.get('/:truckid', trucksCtrl.show);
router.post('/', trucksCtrl.create);
router.put('/:truckid', trucksCtrl.edit)
router.delete('/:truckid', trucksCtrl.delete);

module.exports = router;
