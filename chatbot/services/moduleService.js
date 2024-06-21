const db = require('../db');

// Service function to add a new module type
async function addModuleType(name) {
    return await db.transaction(async trx => {
        try {
            const [id] = await trx('module_types').insert({ name }).returning('id');
            
            return { id, name };
        } catch (err) {
            throw new Error(`Failed to add module type: ${err.message}`);
        }
    });
}

module.exports = {
    addModuleType
};
