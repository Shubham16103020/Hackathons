'use strict';

const category = {
  DROPDOWN_SINGLE_SELECT: "DD_SS",
  DROPDOWN_MULTI_SELECT: "DD_MS",
  CHECKBOX: "CB",
  FREE_TEXT: "FT",
  FREE_TEXT_CURRENCY: "FT_CU",
  FREE_TEXT_PERCENTAGE: "FT_PR",
  FREE_TEXT_NUMBER: "FT_NU",
};

const noGoTypes = {
  RANGE: "RANGE",
  MATH: "MATH",
  INCLUDES: "INCLUDES",
};

exports.up = async function(knex) {
  console.log(`creating configuration.questions table`);
  await knex.schema.withSchema('configuration').createTable('questions', function(table) {
    table.increments('id').primary();
    table.integer('template_id').unsigned();
    table.text('question_code');
    table.text('question_text');
    table.integer('sequence');
    table.boolean('is_mandatory').defaultTo(false);
    table.enu('category', [category.DROPDOWN_SINGLE_SELECT,
      category.DROPDOWN_MULTI_SELECT,
      category.CHECKBOX,
      category.FREE_TEXT,
      category.FREE_TEXT_CURRENCY,
      category.FREE_TEXT_PERCENTAGE,
      category.FREE_TEXT_NUMBER], {
          useNative: true,
          existingType: false,
          enumName: 'questions_category'
      }).defaultTo(category.FREE_TEXT);
    table.string('placeholder', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
    table.timestamp('deleted_at');

    //foreign constraint
    table
      .foreign('template_id')
      .references('id')
      .inTable('configuration.templates')
      .onUpdate('NO ACTION')
      .onDelete('NO ACTION');
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
    table.specificType('valid_answer', 'TEXT[]');
    table.enu('no_go_type', [noGoTypes.RANGE, noGoTypes.MATH, noGoTypes.INCLUDES], {
      useNative: true,
      existingType: false,
      enumName: 'no_go_type'
  }).defaultTo(null);
    table.text('no_go_criteria');
    table.text('error_text');
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
    knex.schema.withSchema('configuration').raw(`DROP SEQUENCE IF EXISTS configuration.answers_id_seq;`),
    knex.schema.withSchema('configuration').raw(`DROP TYPE IF EXISTS configuration.no_go_type;`),
  ]);

  console.log(`Dropping configuration.questions table`);
  await Promise.all([ 
    knex.schema.withSchema('configuration').dropTableIfExists('questions'),
    knex.schema.withSchema('configuration').raw(`DROP SEQUENCE IF EXISTS configuration.questions_id_seq;`),
    knex.schema.withSchema('configuration').raw(`DROP TYPE IF EXISTS configuration.questions_category;`),
  ]);
  
};
