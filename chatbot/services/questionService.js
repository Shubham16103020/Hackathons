const db = require('../db');

// Service functions for questions
async function addQuestion(moduleTypeId, question) {
    return await db.transaction(async trx => {
        try {
            const [id] = await trx('questions').insert({ module_type_id: moduleTypeId, question }).returning('id');
            return { id, moduleTypeId, question };
        } catch (err) {
            throw new Error(`Failed to add question: ${err.message}`);
        }
    });
}


async function getAllQuestions() {
    return await db.transaction(async trx => {
        try {
            const questions = await trx('questions').select('*');
            return questions;
        } catch (err) {
            throw new Error(`Failed to get all questions: ${err.message}`);
        }
    });
}


async function getQuestionById(questionId) {
    return await db.transaction(async trx => {
        try {
            const question = await trx('questions').where('id', questionId).first();
            return question;
        } catch (err) {
            throw new Error(`Failed to get question by ID: ${err.message}`);
        }
    });
}

async function getAnswersByQuestionId(questionId) {
    return await db.transaction(async trx => {
        try {
            const answers = await trx('answers').where('question_id', questionId);
            return answers;
        } catch (err) {
            throw new Error(`Failed to get answers by question ID: ${err.message}`);
        }
    });
}

module.exports = {
    addQuestion,
    getAllQuestions,
    getQuestionById,
    getAnswersByQuestionId
};
