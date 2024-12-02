const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authToken = require('../middleware/authToken');

router.get('/income-expenses', analyticsController.getFeesAndSalaries);


module.exports = router;
