const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('book_chapter_versions', 'is_current_version').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_chapter_versions', function (table) {
        table.boolean('is_current_version')
      }).then(function () {
        log.info('Migration book_chapter_versions new column is_current_version  : success')
      }).catch(function (err) {
        log.error('Migration book_chapter_versions new column is_current_version   : error:' + err)
      })
    }
  })

is_current_version
  await knex.schema.hasColumn('book_scene_versions', 'is_current_version').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_scene_versions', function (table) {
        table.boolean('is_current_version')
      }).then(function () {
        log.info('Migration book_scene_versions new column is_current_version  : success')
      }).catch(function (err) {
        log.error('Migration book_scene_versions new column is_current_version   : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {}
