exports.up = async function (knex) {
    console.log(`creating schemas`);
    await Promise.all([
        knex.raw(`create schema if not exists configuration`),
        knex.raw(`create schema if not exists commons`),
    ]);
};
  
exports.down = async function (knex) {
    console.log(`dropping schemas`);
    await Promise.all([
        knex.raw(`drop schema if exists commons cascade`),
        knex.raw(`drop schema if exists configuration cascade`),
    ]);
};
