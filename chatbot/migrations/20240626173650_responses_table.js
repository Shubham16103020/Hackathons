exports.up = async function(knex) {
    console.log(`creating commons.responses table`);
    await knex.schema.withSchema('commons').createTable('responses', function(table) {
      table.increments('id').primary();
      table.string('response', 50);
      table.integer('question_id').unsigned().notNullable();
      table.string('user_id', 50);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at');
      table.timestamp('deleted_at');
  
    });
    await knex.raw('ALTER SEQUENCE commons.responses_id_seq RESTART WITH 1000000');
    await knex.raw(`
      CREATE TRIGGER set_responses_updated_at_timestamp
      BEFORE UPDATE ON commons.responses
      FOR EACH ROW
      EXECUTE PROCEDURE commons.trigger_set_timestamp();`);
  
    console.log(`creating commons.template_record table`);
    await knex.schema.withSchema('commons').createTable('template_record', table => {
      table.increments('id').primary();
      table.string('user_id', 50);
      table.jsonb('final_payload').unsigned().notNullable();
      table.integer('last_question_id').notNullable();
      table.string('submit_status');
      table.string('submit_endpoint', 50);
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('updated_at');
      table.timestamp('deleted_at');
  
    });
    await knex.raw('ALTER SEQUENCE commons.template_record_id_seq RESTART WITH 1000000');
    await knex.raw(`
      CREATE TRIGGER set_template_record_updated_at_timestamp
      BEFORE UPDATE ON commons.template_record
      FOR EACH ROW
      EXECUTE PROCEDURE commons.trigger_set_timestamp();`);
  };
  
  
  exports.down = async function(knex) {
    console.log(`Dropping commons.templates table`);
    await Promise.all([ 
      knex.schema.withSchema('commons').dropTableIfExists('templates'),
      knex.schema.withSchema('commons').raw(`DROP SEQUENCE IF EXISTS commons.templates_id_seq;`)
    ]);
  
    console.log(`Dropping commons.responses table`);
    await Promise.all([ 
      knex.schema.withSchema('commons').dropTableIfExists('responses'),
      knex.schema.withSchema('commons').raw(`DROP SEQUENCE IF EXISTS commons.responses_id_seq;`)
    ]);
  };
  