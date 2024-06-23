exports.up = async function(knex) {

  console.log(`creating configuration.templates table`);
  await knex.schema.withSchema('configuration').createTable('templates', table => {
    table.increments('id').primary();
    table.jsonb('template').notNullable();
    table.string('template_name', 50);
    table.integer('version').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at');
    table.timestamp('deleted_at');
    table.unique(['template_name', 'version']);
  });
  await knex.raw('ALTER SEQUENCE configuration.templates_id_seq RESTART WITH 1000000');
  await knex.raw(`
    CREATE TRIGGER set_templates_updated_at_timestamp
    BEFORE UPDATE ON configuration.templates
    FOR EACH ROW
    EXECUTE PROCEDURE commons.trigger_set_timestamp();`);

  console.log(`creating configuration.modules table`);
  await knex.schema.withSchema('configuration').createTable('modules', function(table) {
    table.increments('id').primary();
    table.integer('template_id').unsigned().notNullable();
    table.string('module_type', 50);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
    table.timestamp('deleted_at');
    
    //constraints
    table
    .foreign('template_id')
    .references('id')
    .inTable('configuration.templates')
    .onUpdate('NO ACTION')
    .onDelete('NO ACTION');

  });
  await knex.raw('ALTER SEQUENCE configuration.modules_id_seq RESTART WITH 1000000');
  await knex.raw(`
    CREATE TRIGGER set_modules_updated_at_timestamp
    BEFORE UPDATE ON configuration.modules
    FOR EACH ROW
    EXECUTE PROCEDURE commons.trigger_set_timestamp();`);
};


exports.down = async function(knex) {
  console.log(`Dropping configuration.modules table`);
  await Promise.all([ 
    knex.schema.withSchema('configuration').dropTableIfExists('modules'),
    knex.schema.withSchema('configuration').raw(`DROP SEQUENCE IF EXISTS configuration.modules_id_seq;`)
  ]);
  
  console.log(`Dropping configuration.templates table`);
  await Promise.all([ 
    knex.schema.withSchema('configuration').dropTableIfExists('templates'),
    knex.schema.withSchema('configuration').raw(`DROP SEQUENCE IF EXISTS configuration.templates_id_seq;`)
  ]);
};
