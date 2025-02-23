const express = require('express');
const router = express.Router();
const sortedRatesController = require('../controllers/sortRates');

router.get('/', sortedRatesController.getSortedRates);

module.exports = router;