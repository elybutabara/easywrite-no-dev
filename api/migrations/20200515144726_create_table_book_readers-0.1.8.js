const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('book_readers').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('book_readers', function (t) {
        t.increments('id')
        t.text('uuid')
        t.specificType('author_id', 'BLOB')
        t.text('book_id')
        t.text('role')
        t.integer('status')
        t.text('reasons')
        t.integer('allow_feedback_email_notification')
        t.text('created_at')
        t.text('updated_at')
        t.text('deleted_at')
      }).then(function () {
        log.info('Migrate to latest : success')
      }).catch(function (err) {
        log.error('Migrate to latest : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasTable('book_readers').then(async (exists) => {
    if (exists) {
      await knex.schema.dropTable('book_readers').then(function () {
        log.info('Migrate rollback successfuly')
      }).catch(function (err) {
        log.error('Migrated rollback error:' + err)
      })
    }
  })
}
