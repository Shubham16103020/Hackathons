exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('configuration.templates').del()
      .then(function () {
        // Inserts seed entries
        return knex('configuration.templates').insert([
          { id: 200, module_id: 100, template: `{}`, template_name: 'CREDIT FACILITY APPLY',endpoint: `www.qa-finance.com`, version: 1 },
          // Add more seed data as needed
        ]);
      });
  };