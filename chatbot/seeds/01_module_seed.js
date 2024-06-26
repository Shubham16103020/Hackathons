exports.seed = async function(knex) {
    // Deletes ALL existing entries
    return await knex('configuration.modules').del()
      .then(async function () {
        // Inserts seed entries
        return await knex('configuration.modules').insert([
          { id: 100, module_type: 'CREDIT FACILITY'},
          { id: 101, module_type: 'FINANCE'},
          { id: 102, module_type: 'ACCOUNTING'},
          // Add more seed data as needed
        ]);
      });
  };