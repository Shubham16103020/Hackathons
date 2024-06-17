exports.up = function(knex) {
    return knex.schema
      .createTable('questions', function(table) {
        table.increments('id').primary(); // Auto-incrementing primary key
        table.integer('parent_id').unsigned().references('id').inTable('Fields').onDelete('CASCADE'); // Self-referencing foreign key
        table.string('name', 255).notNullable();
        table.string('label', 255);
        table.string('type', 50);
        table.string('placeholder', 255);
        table.boolean('required');
        table.json('options');
      })
      .createTable('answers', function(table) {
        table.increments('id').primary(); // Auto-incrementing primary key
        table.integer('field_id').unsigned().references('id').inTable('Fields').onDelete('CASCADE'); // Foreign key referencing Fields table
        table.string('value', 255);
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('questions')
      .dropTableIfExists('answers');
  };
  