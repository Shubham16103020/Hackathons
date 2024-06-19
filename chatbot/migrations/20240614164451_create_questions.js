exports.up = async function(knex) {
  await knex.schema.createTable('questions', function(table) {
    table.increments('id').primary();
    table.integer('module_id').unsigned();
    table.foreign('module_id').references('module.id'); // Correct schema qualification
    table.text('question_text');
    table.text('order');
    table.text('is_mandatory').defaultTo(false);;
    table.string('name', 255).notNullable();
    table.string('label', 255);
    table.string('type', 50);
    table.string('placeholder', 255);
    // table.boolean('draft').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
    table.timestamp('deleted_at');
  });

  await knex.schema.createTable('answers', function(table) {
    table.increments('id').primary();
    table.integer('question_id').unsigned();
    table.foreign('question_id').references('questions.id'); // Correct schema qualification
    table.text('answer_text');
    table.boolean('is_correct');
    table.date('date_created');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
    table.timestamp('deleted_at');
  });
};


exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('questions')
    .dropTableIfExists('answers');
};
