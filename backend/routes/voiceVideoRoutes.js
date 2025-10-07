// routes/voiceVideoRoutes.js
const express = require('express');
const router = express.Router();
const voiceVideoController = require('../controllers/voiceVideoController');

router.post('/generate', voiceVideoController.generateVoiceAndVideo);

module.exports = router;