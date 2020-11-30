const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('authors', 'birthdate').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('authors', function (table) {
        table.dateTime('birthdate').nullable().defaultTo(null)
      }).then(function () {
        log.info('Migration authors new column reasons : success')
      }).catch(function (err) {
        log.error('Migration authors new column reasons  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {}
