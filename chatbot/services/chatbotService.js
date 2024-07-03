const { response } = require('express');
const db = require('../db');
const {
    getModulesDetailsFromTable, 
    getTemplatesDetailsByModuleId, 
    getFirstQuestionByTemplateId,
    getQuestion,
    addResponses,
    getValidAnswersByQuestionId } = require(`./db_service/chatbotService`);

const ArgumentError = require(`../errors/argument_error`);

const _compare = (operator, operand1, operand2) => {
    switch (operator) {
        case "<":
            return operand1 < operand2;
        case ">":
            return operand1 > operand2;
        case "<=":
            return operand1 <= operand2;
        case ">=":
            return operand1 >= operand2;
        case "==":
            return operand1 === operand2;
        case "!=":
            return operand1 !== operand2;
    }
    return false;
}

const _evaluateNoGoCriteria = (noGoType, noGoCriteria, value) => {
    let passed = true;
    switch (noGoType) {
        case "MATH":
            const result = noGoCriteria.split(/^\s*(>=|<=|>|<|==|!=)\s*/);
            if (result && result.length == 3)
                passed = !(_compare(result[1], Number(value), Number(result[2])));
            break;
        case "RANGE":
            result = noGoCriteria.split(`-`);
            if (result && result.length === 3)
                passed = !(_compare('<=', Number(result[0]), Number(value)) && _compare('<=', Number(value), Number(result[2])));
            break;
        case "INCLUDES": const notAllowed = noGoCriteria.split('|');
            if (notAllowed.includes(value))
                passed = false;
            break;
        default:
            passed = false;
    }
    return passed;
}

const _getAllModules = async (trx) => {
    let moduleDetails =  await getModulesDetailsFromTable(trx);
    let moduleResArray = [{
        fieldType: 'keyValueSelectType',
        label: 'Module Type',
        category_type: 'MODULE',
        category_id: 100,
        options: moduleDetails
      }];
    return moduleResArray;
};
const _getTemplatesByModuleId = async (trx, moduleId) => {
    let templateDetails =  await getTemplatesDetailsByModuleId(trx, moduleId);
    let teamplateResArray = [{
        fieldType: 'keyValueSelectType',
        label: 'Template Type',
        category_type: 'TEMPLATE',
        options: templateDetails
      }]
    return teamplateResArray;
};
const _getFirstQuestionByTemplateId = async (trx, templateId) => {
    let questionDetails =  await getFirstQuestionByTemplateId(trx, templateId);
    questionDetails.forEach(element => {
        element.category_type = 'QUESTION'
    });
    return questionDetails;
};
const _getQuestion = async (trx, id, type, command = null) => {
    let action = null;
    switch(command){
        case 'goBack': 
            action = 'previous';
            break;

        case 'unknown': 
            action = 'same';
            break;

        case 'reset':
            action = 'first';
            break;
        default: 
            if(id == null && type == null)
                action = 'first';
            
            else 
                action = 'next';
            break;
    }
    type = type !== null ?  type : "QUESTION";
    let questionDetails =  await getQuestion(trx, action, id, type);
    return questionDetails;
};


module.exports = {
    getChatBotQuestion : async (queryParams) => {
        return await db.transaction(async trx => {
            let key = null;
            let res = null;
            if(!(Object.keys(queryParams).length === 0)){
                key = queryParams.category_type;
            }
            const categoryId = queryParams.category_id ? queryParams.category_id : null;
            const categoryType = queryParams.category_type ? queryParams.category_type : null;
            res = await _getQuestion(trx, categoryId, categoryType, queryParams.command);
            return {meta: res};
        })
    },
    validateChatBotAnswers: async (inputPayload) => {
        return await db.transaction(async trx => {
            // if(!(Object.keys(inputPayload).length === 0)){
            //     key = inputPayload.key;
            // }
            // if(inputPayload.key == 'QUESTION'){//will need to validate the no-go criterias
            //     console.log(`Question ID: ${inputPayload.id}`);
            //     const [validAnswers] = await getValidAnswersByQuestionId(trx, inputPayload.id);
            //     let passed = true;
            //     if(validAnswers.valid_answer && validAnswers.valid_answer.length){
            //         passed = validAnswers.valid_answer.includes(inputPayload.value) ? true : false;
            //     }

            //     const noGoType = validAnswers.no_go_type ? validAnswers.no_go_type : null;
            //     const noGoCriteria = validAnswers.no_go_criteria ? validAnswers.no_go_criteria : null;
            //     if (noGoType && noGoCriteria){
            //         passed = _evaluateNoGoCriteria(noGoType, noGoCriteria, inputPayload.value);
            //     }
                    
            //     if (!passed) throw new ArgumentError(validAnswers.error_text);
                    
            // }
            return [{id: 100, value: 'CREDIT FACILITY'}, {id: 101, value: 'FINANCE'}, {id: 102, value: 'ACCOUNTING'}];
        })
    },

    postChatBotAnswers : async (inputPayload) => {
        return await db.transaction(async trx => {
            let responseObj = {
                response: inputPayload,
                category_id: inputPayload.category_id,
                category_type: inputPayload.category_type
            }
            await addResponses(trx, responseObj);
            const activeTemplateRecordDetails = await getActiveTemplateRecordDetails(trx);
            let templateRecObj = activeTemplateRecordDetails.length != 0 ? activeTemplateRecordDetails[0] : {};
            switch(inputPayload.category_type) {
                case 'MODULE':
                    templateRecObj.module_id = inputPayload.predictedMessageId;
                    break;
                case 'TEMPLATE':
                    templateRecObj.template_id = inputPayload.predictedMessageId;
                    break;
                case 'QUESTION':
                    let finalPayload = templateRecObj.final_payload
                    break;
            }
            let status = null;
            switch(inputPayload.command){
                case 'save':
                case 'submit':

                    break;
                default:
                    status = 'ACTIVE'
                    break;
            }

            await upsertTemplateRecord(trx, responseObj);
        })
    },
}
