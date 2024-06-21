const questionService = require('../services/questionService');

// Controller functions for questions
async function addQuestion(req, res) {
    const { moduleTypeId, question } = req.body;
    try {
        const addedQuestion = await questionService.addQuestion(moduleTypeId, question);
        res.json(addedQuestion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getAllQuestions(req, res) {
    try {
        const questions = await questionService.getAllQuestions();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getQuestionById(req, res) {
    const questionId = req.params.id;
    try {
        const question = await questionService.getQuestionById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getAnswersByQuestionId(req, res) {
    const questionId = req.params.id;
    try {
        const answers = await questionService.getAnswersByQuestionId(questionId);
        res.json(answers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    addQuestion,
    getAllQuestions,
    getQuestionById,
    getAnswersByQuestionId
};
