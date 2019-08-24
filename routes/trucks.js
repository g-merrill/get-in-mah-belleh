const express = require('express');
const router = express.Router();
const trucksCtrl = require('../controllers/trucks');

/* GET trucks homepage. */
router.get('/', trucksCtrl.index);
router.get('/new', trucksCtrl.new);
router.get('/:id', trucksCtrl.show);
router.post('/', trucksCtrl.create);
router.put('/:id', trucksCtrl.edit)
router.delete('/:id', trucksCtrl.delete);

module.exports = router;
