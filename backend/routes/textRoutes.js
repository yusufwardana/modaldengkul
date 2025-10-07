// routes/textRoutes.js
const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');

router.post('/generate', textController.generateText);

module.exports = router;