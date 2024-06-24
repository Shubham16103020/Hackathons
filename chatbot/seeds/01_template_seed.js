exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('configuration.templates').del()
      .then(function () {
        // Inserts seed entries
        return knex('configuration.templates').insert([
          { id: 100, template: {}, template_name: 'Company KYC', version: 1 },
          // Add more seed data as needed
        ]);
      });
  };