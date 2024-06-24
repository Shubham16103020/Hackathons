exports.seed = async function(knex) {
    // Deletes ALL existing entries
    return await knex('configuration.modules').del()
      .then(async function () {
        // Inserts seed entries
        return await knex('configuration.modules').insert([
          { id: 200, template_id: 100, module_type: 'Company Profile'},
          { id: 201, template_id: 100, module_type: 'Company Details'},
          { id: 202, template_id: 100, module_type: 'Company KYC Information'},
          // Add more seed data as needed
        ]);
      });
  };