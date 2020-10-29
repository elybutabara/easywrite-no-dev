const log = require('electron-log')
exports.up = async function (knex) {
  let isExist = false
  let hasError = false
  await knex.schema.hasTable('notifications').then(async (exists) => {
    isExist = exists
  })

  if (isExist) {
    await knex.schema.dropTable('notifications').then(function () {
      hasError = false
    }).catch(function (err) {
      hasError = true
      log.error('old notifications deleted error:' + err)
    })
  }

  if (!hasError) {
    await knex.schema.createTable('notifications', function (t) {
      t.increments('id')
      t.string('uuid')
      t.string('book_id')
      t.integer('from')
      t.integer('to')
      t.integer('parent_id')
      t.string('parent_name')
      t.boolean('status')
      t.string('type')
      t.string('action')
      t.text('created_at')
      t.text('updated_at')
      t.text('deleted_at')
    }).then(function () {
      log.info('Migrate to latest : success')
    }).catch(function (err) {
      log.error('Migrate to latest : error:' + err)
    })
  }
}

exports.down = async function (knex) {
  await knex.schema.dropTable('notifications').then(function () {
    log.info('Migrate rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated rollback error:' + err)
  })
}
