const log = require('electron-log')

exports.up = async function (knex) {
  await knex.schema.hasColumn('app_settings', 'run_count').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('app_settings', function (table) {
        table.integer('run_count').defaultTo(0)
      }).then(function () {
        log.info('Migration authors deleted_at new column run_count : success')
      }).catch(function (err) {
        log.error('Migration authors deleted_at new column run_count  : error:' + err)
      })
    }
  })

  await knex.schema.hasColumn('app_settings', 'api_url').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('app_settings', function (table) {
        table.text('api_url')
      }).then(function () {
        log.info('Migration authors deleted_at new column api_url : success')
      }).catch(function (err) {
        log.error('Migration authors deleted_at new column api_url  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasColumn('app_settings', 'run_count').then(async (exists) => {
    if (exists) {
      await knex.schema.table('app_settings', function (table) {
        table.dropColumn('run_count')
      }).then(function () {
        log.info('Migration app_settings run_count drop column run_count : success')
      }).catch(function (err) {
        log.error('Migration app_settings run_count drop column run_count  : error:' + err)
      })
    }
  })

  await knex.schema.hasColumn('app_settings', 'api_url').then(async (exists) => {
    if (exists) {
      await knex.schema.table('app_settings', function (table) {
        table.dropColumn('api_url')
      }).then(function () {
        log.info('Migration app_settings api_url drop column api_url : success')
      }).catch(function (err) {
        log.error('Migration app_settings api_url drop column api_url  : error:' + err)
      })
    }
  })
}
