const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('book_scenes', 'hidden').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_scenes', function (table) {
        table.integer('hidden').after('weather_type')
      }).then(function () {
        log.info('Migration book_scenes new column hidden : success')
      }).catch(function (err) {
        log.error('Migration book_scenes new column hidden : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasColumn('book_scenes', 'hidden').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_scenes', function (table) {
        table.dropColumn('hidden')
      }).then(function () {
        log.info('Migration book_characters drop column hidden : success')
      }).catch(function (err) {
        log.error('Migration book_characters drop column hidden  : error:' + err)
      })
    }
  })
}
