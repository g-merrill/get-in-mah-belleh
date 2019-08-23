const express = require('express');
const router = express.Router();
const trucksCtrl = require('../controllers/api/trucks');

router.get('/trucks', trucksCtrl.index);
router.post('/trucks', trucksCtrl.create);





module.exports = router;