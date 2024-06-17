// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

    development: {
        client: 'pg',
        connection: {
          host: 'localhost',
          port: 5432,
          database: 'chatbot'
        },
        migrations: {
          directory: './migrations'
        },
        seeds: {
          directory: './seeds'
        }
      }

};
