exports.up = async function (knex) {
    console.log(`adding common functions`);
    await knex.schema.withSchema('commons').raw(
      `CREATE OR REPLACE FUNCTION commons.trigger_set_timestamp() 
         RETURNS TRIGGER AS 
         $$ BEGIN NEW.updated_at = NOW(); 
         RETURN NEW; END; $$ 
         LANGUAGE plpgsql;`
    );
  };
  
  exports.down = async function (knex) {
    console.log(`dropping common functions`);
    await knex.schema.withSchema('commons').raw(`drop function if exists trigger_set_timestamp`);
  };
  