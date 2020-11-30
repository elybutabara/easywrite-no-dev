const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('app_settings').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('app_settings', function (t) {
        t.increments('id')
        t.text('uuid')
        t.text('user_id')
        t.text('app_version')
        t.text('language')
        t.text('created_at')
        t.text('updated_at')
        t.text('deleted_at')
      }).then(function () {
        log.info('Migrate to latest app_settings: success')
      }).catch(function (err) {
        log.error('Migrate to latest app_settings: error:' + err)
      })
    } else {
      log.info('app_settings exist')
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasTable('app_settings').then(async (exists) => {
    if (exists) {
      await knex.schema.dropTable('app_settings').then(function () {
        log.info('Migrate rollback app_settings successfuly')
      }).catch(function (err) {
        log.error('Migrated rollback app_settings error:' + err)
      })
    }
  })
}
