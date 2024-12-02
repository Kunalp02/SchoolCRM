const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authToken = require('../middleware/authToken');

router.post('/login', authController.login);
router.post('/signup', authController.register);
router.get('/getCounts', authController.getCounts);
router.get('/profile', authToken, authController.profile);
router.post('/updateProfile', authToken, authController.updateProfile);

module.exports = router;
