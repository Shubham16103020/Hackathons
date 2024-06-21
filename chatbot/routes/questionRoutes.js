const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// Routes for questions
router.post('/', questionController.addQuestion);
router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.get('/:id/answers', questionController.getAnswersByQuestionId);
//  save as draft
module.exports = router;
