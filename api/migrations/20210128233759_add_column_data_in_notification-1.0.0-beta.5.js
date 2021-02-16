const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('notifications', 'data').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('notifications', function (table) {
        table.text('data')
      }).then(function () {
        log.info('Migration notifications new column data : success')
      }).catch(function (err) {
        log.error('Migration notifications new column data  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {}
