module.exports = (table, {inTable, references, field}) => {
  const _references = references || 'uid';
  const _field = field || `${inTable}_${_references}`;

  table
    .foreign(_field, `fk_${table._tableName}_${_field}`)
    .references(_references)
    .inTable(inTable);

  table.index(_field, `idx_${table._tableName}_${_field}`);
};
