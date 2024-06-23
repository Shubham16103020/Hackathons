exports.up = async function(knex) {
  console.log(`creating configuration.questions table`);
  await knex.schema.withSchema('configuration').createTable('questions', function(table) {
    table.increments('id').primary();
    table.integer('module_id').unsigned();
    table.foreign('module_id').references('module.id'); // Correct schema qualification
    table.text('question_text');
    table.integer('sequence');
    table.boolean('is_mandatory').defaultTo(false);
    table.string('type', 50);
    table.string('placeholder', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
    table.timestamp('deleted_at');
  });
  await knex.raw('ALTER SEQUENCE configuration.questions_id_seq RESTART WITH 1000000');
  await knex.raw(`
    CREATE TRIGGER set_questions_updated_at_timestamp
    BEFORE UPDATE ON configuration.questions
    FOR EACH ROW
    EXECUTE PROCEDURE commons.trigger_set_timestamp();`);

  console.log(`creating configuration.answers table`);
  await knex.schema.withSchema('configuration').createTable('answers', function(table) {
    table.increments('id').primary();
    table.integer('question_id').unsigned();
    table.text('answer_text');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
    table.timestamp('deleted_at');

    //constraints
    table
      .foreign('question_id')
      .references('id')
      .inTable('configuration.questions')
      .onUpdate('NO ACTION')
      .onDelete('NO ACTION');
  });
  await knex.raw('ALTER SEQUENCE configuration.answers_id_seq RESTART WITH 1000000');
  await knex.raw(`
    CREATE TRIGGER set_answers_updated_at_timestamp
    BEFORE UPDATE ON configuration.answers
    FOR EACH ROW
    EXECUTE PROCEDURE commons.trigger_set_timestamp();`);

};

exports.down = async function(knex) {
  console.log(`Dropping configuration.answers table`);
  await Promise.all([ 
    knex.schema.withSchema('configuration').dropTableIfExists('answers'),
    knex.schema.withSchema('configuration').raw(`DROP SEQUENCE IF EXISTS configuration.answers_id_seq;`)
  ]);

  console.log(`Dropping configuration.questions table`);
  await Promise.all([ 
    knex.schema.withSchema('configuration').dropTableIfExists('questions'),
    knex.schema.withSchema('configuration').raw(`DROP SEQUENCE IF EXISTS configuration.questions_id_seq;`)
  ]);
  
};
