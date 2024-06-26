'use strict';

module.exports = {
    insertTemplate: async (trx, template, templateName)  => {
        // Check if a template with the same name exists and get the max version
        const result = await trx('configuration.templates')
            .where('template_name', templateName)
            .max('version as max_version')
            .first();

        const maxVersion = result.max_version || 0;

        // Insert the new template with the appropriate version
        const templateId = await trx.insert({
            template: template,
            template_name: templateName,
            version: maxVersion + 1
        }).into('configuration.templates').returning('id');
        console.log(`Template inserted successfully with template Id: ${templateId}`);
    },
    insertIntoTable: async (trx, tableName, insertObj) => {
        return await trx.insert(insertObj).into(tableName).returning(`id`);
    }
};
