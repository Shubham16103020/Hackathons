const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Routes for questions
router.get('/', chatbotController.getChatBotQuestion);
router.post('/save', chatbotController.postChatBotAnswers);
router.post('/:category_type/:category_id', chatbotController.validateChatBotAnswers);

//  save as draft
module.exports = router;