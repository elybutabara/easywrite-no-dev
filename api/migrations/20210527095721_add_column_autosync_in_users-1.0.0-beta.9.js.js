const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('users', 'autosync').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('users', function (table) {
        table.integer('autosync').defaultTo(1).after('last_login')
      }).then(function () {
        log.info('Migration users new column autosync : success')
      }).catch(function (err) {
        log.error('Migration users new column autosync : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasColumn('users', 'autosync').then(async (exists) => {
    if (exists) {
      await knex.schema.table('users', function (table) {
        table.dropColumn('autosync')
      }).then(function () {
        log.info('Migration users drop column autosync : success')
      }).catch(function (err) {
        log.error('Migration users drop column autosync  : error:' + err)
      })
    }
  })
}
