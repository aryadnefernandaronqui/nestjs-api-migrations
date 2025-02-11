const { basics } = require('../helpers/auditoryFields');

exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('uid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('password', 255).notNullable();
    table.string('email', 255).notNullable().unique();

    basics(knex, table);
  });

};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
