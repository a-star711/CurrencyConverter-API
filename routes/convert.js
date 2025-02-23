const express = require('express');
const router = express.Router();
const convertController = require('../controllers/convert');

router.post('/', convertController.convertRates);

module.exports = router;