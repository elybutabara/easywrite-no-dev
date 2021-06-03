const log = require('electron-log')

exports.up = async function (knex) {
  await knex.schema.hasColumn('courses', 'deleted_at').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('courses', function (table) {
        table.text('deleted_at')
      }).then(function () {
        log.info('Migration courses new column deleted_at : success')
      }).catch(function (err) {
        log.error('Migration courses new column deleted_at : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasColumn('courses', 'deleted_at').then(async (exists) => {
    if (exists) {
      await knex.schema.table('courses', function (table) {
        table.dropColumn('deleted_at')
      }).then(function () {
        log.info('Migration courses drop column deleted_at : success')
      }).catch(function (err) {
        log.error('Migration courses drop column deleted_at : error:' + err)
      })
    }
  })
}
