const express = require('express');
const { askEcoBot } = require('../controllers/chatController');
const router = express.Router();

router.post('/ask', askEcoBot);

module.exports = router;
