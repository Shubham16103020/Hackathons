exports.up = async function(knex) {
  await knex.schema.createTable('module', function(table) {
    table.increments('id').primary();
    table.string('module_type', 50);
    table.string('created_by', 100);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
    table.timestamp('deleted_at');
  });
  await knex.schema.createTable('templates', table => {
    table.increments('id').primary();
    table.integer('module_id').unsigned().notNullable();
    table.foreign('module_id').references('module.id');
    table.jsonb('template').notNullable();
    table.integer('version').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at');
    table.timestamp('deleted_at');
    table.unique(['module_id', 'version']);
  });
};


exports.down = function(knex) {
  return knex.schema.dropTable('module');
};
