exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('FieldValues').del()
    .then(function () {
      // Inserts seed entries
      return knex('FieldValues').insert([
        { field_id: 1, value: 'Aatreya' },
        { field_id: 1, value: 'Kranti' },
        { field_id: 2, value: 'Tata' },
        { field_id: 2, value: 'Maruti' },
        // Add more seed data as needed
      ]);
    });
};
