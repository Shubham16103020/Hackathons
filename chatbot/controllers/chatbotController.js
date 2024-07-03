'use strict';
const {getChatBotQuestion, postChatBotAnswers, validateChatBotAnswers} = require(`../services/chatbotService`);
const respondError = require('../errors/respond_errors');
module.exports = {
    getChatBotQuestion: async (req, res) => {
        try {
            const queryParams = req.query;

            console.log("getChatBotQuestion: entring controller");
            // const { validatedPayload, error: payloadValidationError } = joiValidation.validate(
            //     getChatBotQuestionSchema,
            //     payload
            // );
        
            // if (payloadValidationError) {
            //     throw new JoiSchemaError(payloadValidationError.message);
            // }
            
            const response = await getChatBotQuestion(queryParams);
            console.log("getChatBotQuestion: exiting controller");
            res.json(response);
        } catch (err) {
            const errorMessage = `Error in getChatBotQuestion controller : ${err.message}`;
            console.log(errorMessage);
            respondError(res, err);
        }
    },
    validateChatBotAnswers: async (req, res) => {
        try {
            const payload = req.body;

            console.log("validateChatBotAnswers: entring controller");
            // const { validatedPayload, error: payloadValidationError } = joiValidation.validate(
            //     getChatBotQuestionSchema,
            //     payload
            // );
        
            // if (payloadValidationError) {
            //     throw new JoiSchemaError(payloadValidationError.message);
            // }
            
            const validChatbotAnswerRes = await validateChatBotAnswers(payload);
            console.log("validateChatBotAnswers: exiting controller");
            res.json(validChatbotAnswerRes);
        } catch (err) {
            const errorMessage = `Error in getChatBotQuestion controller : ${err.message}`;
            console.log(errorMessage);
            respondError(res, err);
        }
    },
    postChatBotAnswers: async (req, res) => {
        try {
            const payload = req.body;

            console.log("postChatBotAnswers: entring controller");
            // const { validatedPayload, error: payloadValidationError } = joiValidation.validate(
            //     getChatBotQuestionSchema,
            //     payload
            // );
        
            // if (payloadValidationError) {
            //     throw new JoiSchemaError(payloadValidationError.message);
            // }
            
            await postChatBotAnswers(payload);
            console.log("postChatBotAnswers: exiting controller");
            res.json({success: true});
        } catch (err) {
            const errorMessage = `Error in getChatBotQuestion controller : ${err.message}`;
            console.log(errorMessage);
            respondError(res, err);
        }
    },
}