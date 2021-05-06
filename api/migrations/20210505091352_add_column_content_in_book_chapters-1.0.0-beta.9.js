const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('book_chapters', 'content').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_chapters', function (table) {
        table.text('content').after('title')
      }).then(async function () {
        // Script that will update the new content column in book_chapters value to latest chapter version or is current version
        await knex.raw('UPDATE book_chapters SET content = ( SELECT BCV.content FROM book_chapter_versions AS BCV WHERE BCV.chapter_id = book_chapters.uuid GROUP BY BCV.chapter_id ORDER BY BCV.is_current_version DESC, BCV.created_at DESC )')

        log.info('Migration book_chapters new column content : success')
      }).catch(function (err) {
        log.error('Migration book_chapters new column content  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasColumn('book_chapters', 'content').then(async (hasColumn) => {
    if (!hasColumn) {
      await knex.schema.alterTable('book_chapters', function (table) {
        table.dropColumn('content')
      }).then(function () {
        log.info('Migrate book_chapters new column content rollback successfuly')
      }).catch(function (err) {
        log.error('Migrate book_chapters new column content rollback error:' + err)
      })
    }
  })
}
