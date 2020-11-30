const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('assignments', 'is_treadlinable').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('assignments', function (table) {
        table.integer('is_treadlinable').defaultTo(0).notNullable()
      }).then(function () {
        log.info('Migration assignments is_treadlinable new column comments : success')
      }).catch(function (err) {
        log.error('Migration assignments is_treadlinable new column comments  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasColumn('assignments', 'is_treadlinable').then(async (exists) => {
    if (exists) {
      await knex.schema.table('assignments', function (table) {
        table.dropColumn('is_treadlinable')
      }).then(function () {
        log.info('Migration assignments is_treadlinable drop column comments : success')
      }).catch(function (err) {
        log.error('Migration assignments is_treadlinable drop column comments  : error:' + err)
      })
    }
  })
}
