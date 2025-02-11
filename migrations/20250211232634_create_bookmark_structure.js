const { basics } = require('../helpers/auditoryFields');

exports.up = function(knex) {
  return knex.schema.createTable('bookmarks', function(table) {
    table.uuid('uid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title', 255).notNullable();
    table.string('author', 255).notNullable();
    table.string('description', 255).notNullable();
    table.string('link', 255).notNullable();

    basics(knex, table);
  });

};

exports.down = function(knex) {
  return knex.schema.dropTable('bookmarks');
};
