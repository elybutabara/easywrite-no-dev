const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('book_scenes', 'content').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_scenes', function (table) {
        table.text('content').after('title')
      }).then(async function () {
        // Script that will update the new content column in book_scenes value to latest scene version or is current version
        await knex.raw('UPDATE book_scenes SET content = ( SELECT BSV.content FROM book_scene_versions AS BSV WHERE BSV.book_scene_id = book_scenes.uuid GROUP BY BSV.book_scene_id ORDER BY BSV.is_current_version DESC, BSV.created_at DESC )')

        log.info('Migration book_scenes new column content : success')
      }).catch(function (err) {
        log.error('Migration book_scenes new column content  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasColumn('book_scenes', 'content').then(async (hasColumn) => {
    if (!hasColumn) {
      await knex.schema.alterTable('book_scenes', function (table) {
        table.dropColumn('content')
      }).then(function () {
        log.info('Migrate book_scenes new column content rollback successfuly')
      }).catch(function (err) {
        log.error('Migrate book_scenes new column content rollback error:' + err)
      })
    }
  })
}
