'use strict';

module.exports = {
    getModulesDetailsFromTable: async (db) => { 
        return await db.select(
            `module.id as category_id`,
            `module.module_type as value`
        ).from(`configuration.modules as module`);
    },
    getTemplatesDetailsByModuleId: async (db, moduleId) => {
        return await db.select(
            `template.module_id`,
            `template.id as category_id`,
            `template.template_name as value`
        ).from(`configuration.templates as template`)
        .where(`template.module_id`, moduleId);
    },
    getFirstQuestionByTemplateId: async (db, templateId) => {
        return await db.select(
            `question.id as category_id`,
            `question.question_text as label`,
            `question.category as fieldType`,
            `question.placeholder as options`,
            `question.is_mandatory`,
            `question.sequence`
        ).from(`configuration.questions as question`)
        .where(`question.template_id`, templateId)
        .orderBy(`question.sequence`, "ASC")
        .limit(1);
    },
    getNextQuestionByQuestionId: async (db, questionId) => {
        return await db.select(
            `question.id as category_id`,
            `question.question_text as label`,
            `question.category as fieldType`,
            `question.placeholder as options`,
            `question.is_mandatory`,
            `question.sequence`
        ).from(`configuration.questions as question1`)
        .join(`configuration.questions as question`, function() {
            this.on(`question1.template_id`,`question.template_id`)
                .andOn('question1.sequence', '<', 'question.sequence');
        })
        .where(`question1.id`, questionId)
        .orderBy(`question.sequence`, "ASC")
        .limit(1);
    },
      
    getQuestion : async (trx, action, id, type) => {
        console.log(`action: ${action}`);
        console.log(`id: ${id}`);
        console.log(`type: ${type}`);
        let query = trx('configuration.questions').select(
            `id as category_id`,
            `question_code as category_type`,
            `question_text as label`,
            `category as fieldType`,
            `placeholder as options`,
            `is_mandatory`,
            `sequence`
        );
        
        switch (action) {
            case 'first':
                query = query.where('question_code', type)
                            .andWhere('sequence', trx('configuration.questions').min('sequence').where('question_code', type));
                break;
        
            case 'same':
                if (id !== null) {
                    query = query.where('id', id);
                }
                break;
        
            case 'next':
                if (id !== null) {
                    query = query.where('question_code', type)
                                .andWhere('sequence', '>', trx('configuration.questions').select('sequence').where('id', id))
                                .orderBy('sequence', 'asc')
                                .limit(1);
                }
                break;
        
            case 'previous':
                if (id !== null) {
                    query = query.where('question_code', type)
                                .andWhere('sequence', '<', trx('configuration.questions').select('sequence').where('id', id))
                                .orderBy('sequence', 'desc')
                                .limit(1);
                }
                break;
        
            default:
                throw new Error('Invalid action');
    }
    
    const result = await query;
    return result;
    },
    addResponses: async (db, resObj) => {
        return db.insert(resObj).into(`commons.responses`).returning(`id`);
    },
    getValidAnswersByQuestionId: async (db, questionId) => {
        return await db.select(`*`).from(`configuration.answers`).where(`question_id`, questionId);
    },
    getActiveTemplateRecordDetails: async (db) => {
        return await db.select(`*`).from(`configuration.template_record`).where(`status`, 'ACTIVE');
    }
};