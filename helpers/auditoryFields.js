const _generateFields = (knex, table, field) => {
  const _field = `${field}_by`;

  table.uuid(_field).nullable();

  if (field === 'created') {
    table.timestamp(`${field}_at`).defaultTo(knex.fn.now());
  } else {
    table.timestamp(`${field}_at`).nullable();
  }
};

const _generateFieldsDown = (knex, table, field) => {
  const _fieldBy = `${field}_by`;
  const _fieldAt = `${field}_at`;

  table.dropColumn(_fieldBy);
  table.dropColumn(_fieldAt);
};

const auditoryFields = {
  created(knex, table) {
    _generateFields(knex, table, 'created');
  },

  updated(knex, table) {
    _generateFields(knex, table, 'updated');
  },

  deleted(knex, table, hasToCreateIsDeleted = false) {
    hasToCreateIsDeleted && table.boolean('is_deleted').notNullable().defaultTo(false);

    _generateFields(knex, table, 'deleted');
  },

  basics(knex, table) {
    auditoryFields.created(knex, table);
    auditoryFields.updated(knex, table);
  },

  all(knex, table, hasToCreateIsDeleted = false) {
    auditoryFields.basics(knex, table);
    auditoryFields.deleted(knex, table, hasToCreateIsDeleted);
  },

  createdDown(knex, table) {
    _generateFieldsDown(knex, table, 'created');
  },

  updatedDown(knex, table) {
    _generateFieldsDown(knex, table, 'updated');
  },

  deletedDown(knex, table) {
    _generateFieldsDown(knex, table, 'deleted');
  },

  basicsDown(knex, table) {
    auditoryFields.createdDown(knex, table);
    auditoryFields.updatedDown(knex, table);
  },

  allDown(knex, table) {
    auditoryFields._basicsDown(knex, table);
    auditoryFields.deletedDown(knex, table);
  }
};

module.exports = auditoryFields;
