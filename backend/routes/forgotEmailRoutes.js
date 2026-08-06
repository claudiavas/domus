const express = require('express');
const router = express.Router();
const forgotEmailController = require('../controllers/forgotEmailController');

// Password recovery email route
router.post('/', forgotEmailController.sendEmail);

module.exports = router;