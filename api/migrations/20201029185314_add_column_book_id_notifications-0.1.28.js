const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('notifications', 'book_id').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('notifications', function (table) {
        table.integer('book_id')
      }).then(function () {
        log.info('Migration book_id uuid new column book_id : success')
      }).catch(function (err) {
        log.error('Migration book_id uuid new column book_id  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {}
