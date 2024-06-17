exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('questions').del()
    .then(function () {
      // Inserts seed entries
      return knex('questions').insert([
        { name: 'What is your name?', label: 'Label 1', type: 'text', placeholder: 'Enter name', required: true, options: null },
        { name: 'Which is your fav car?', label: 'Label 2', type: 'Dropdown', placeholder: 'Select one', required: false, options: null },
        // Add more seed data as needed
      ]);
    });
};


/*


question,option,example_input
"What is your name?", "Aatreya", "Red"
"What is your favorite color?", "Red", "Rd"
"What is your favorite color?", "Red", "R"
"What is your favorite color?", "Blue", "Blu"
"What is your favorite color?", "Blue", "Bl"
"What is your favorite color?", "Green", "Gr"



*/