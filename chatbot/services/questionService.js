const db = require('../db');
const {insertIntoTable, insertTemplate } = require(`./db_service/configuration`);

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
const _insertQuestionsAndModuleDetails = async (trx, questionToModuleMap, templateId) => {
    
    for (const [key, value] of questionToModuleMap) {
        let moduleDetailsObj = {
            template_id: templateId,
            module_type: key
        }
        let moduleId = await insertIntoTable(trx, `configuration.modules`, moduleDetailsObj);
        for(const questionDetailsObj of value){
            questionDetailsObj.module_id = moduleId;
            let questionId = await insertIntoTable(trx, `configuration.questions`, questionDetailsObj);
            console.log(`Question has been successfully setup for module: '${key}', with question Id: ${questionId}`);
        }
    }
};

module.exports = {
    addQuestion,
    getAllQuestions,
    getQuestionById,
    getAnswersByQuestionId,
    addTemplate : async (trx, templateData, templateName) => {
        //insert into template table
        const templateId = await insertTemplate(trx, templateData, templateName);

        //now our NPL must understand templateData(which is in HTML form) and extract informations such that we can setup modules table and questions tables.
        /** 
         * we require module type for modules table
         * we require question set details for each module
         * question set details consists of: 
         *      module_id, 
         *      question_text, 
         *      sequence, 
         *      is_mandatory, 
         *      category, 
         *      placeholders(if any)
         */
        //NOTE:** NPM EXCTRACTION CODE LOGIC WOULD GO HERE **/
        // const questionToModuleMap = await npmLogicFunction();
        
        /** questionToModuleMap this map will have module type as a key 
         * and its values would store the list of question details belonging to that module.
         * questionToModuleMap = 
         * {
         *      Company Profile : [{
         *          question_text: 'Company Name',
         *          sequence: 1,
         *          is_mandatory: true,
         *          category: 'FREE_TEXT',
         *          placeholder: null
         *      }, {}, {},..],
         *      
         *      Company KYC Information: [{
         *          question_text: 'Any check returns in last 12 months',
         *          sequence: 1,
         *          is_mandatory: true,
         *          category: 'DROPDOWN_SINGLE_SELECT',
         *          placeholder: ['YES', 'NO']
         *      }]
         * }
         * 
         */ 

        //assuming we have these details as of now directly in json only
        const questionToModuleMap = await _extractQuestionWithModuleDetails(templateData);
        await _insertQuestionsAndModuleDetails(trx, questionToModuleMap, templateId);
    },
};
