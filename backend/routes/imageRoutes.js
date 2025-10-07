// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.post('/generate', imageController.generateImages);

module.exports = router;