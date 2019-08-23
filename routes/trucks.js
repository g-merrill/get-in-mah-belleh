const express = require('express');
const router = express.Router();
const passport = require('passport');
const trucksCtrl = require('../controllers/trucks');

/* GET trucks homepage. */
router.get('/', trucksCtrl.index);
router.get('/new', trucksCtrl.new);
router.post('/', trucksCtrl.create);
router.get('/:id', trucksCtrl.show);
router.delete('/:id', trucksCtrl.delete);

module.exports = router;
