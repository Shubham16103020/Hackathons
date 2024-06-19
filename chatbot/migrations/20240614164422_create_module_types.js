exports.up = async function(knex) {
  await knex.schema.createTable('module', function(table) {
    table.increments('id').primary();
    table.string('module_type', 50);
    table.string('created_by', 100);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
    table.timestamp('deleted_at');
  });
};


exports.down = function(knex) {
  return knex.schema.dropTable('module');
};
