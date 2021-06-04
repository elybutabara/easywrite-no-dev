const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */
  await knex.schema.createTable('admin_treadline', function (t) {
    t.increments('id')
    t.string('uuid', 255)
    t.string('title', 255)
    t.text('core_of_story')
    t.text('question_1')
    t.text('comment_1')
    t.text('question_2')
    t.text('comment_2')
    t.text('question_3')
    t.text('comment_3')
    t.text('question_4')
    t.text('comment_4')
    t.text('question_5')
    t.text('comment_5')
    t.text('question_6')
    t.text('comment_6')
    t.text('question_7')
    t.text('comment_7')
    t.text('question_8')
    t.text('comment_8')
    t.text('question_9')
    t.text('comment_9')
    t.text('question_10')
    t.text('comment_10')
    t.text('question_11')
    t.text('comment_11')
    t.text('ending')
    t.timestamps()
    t.dateTime('deleted_at')
  }).then(function () {
    log.info('admin_treadline migration : success')
  }).catch(function (err) {
    log.error('admin_treadline migration : error:' + err)
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('admin_treadline').then(function () {
    log.info('admin_treadline migration rollback successfuly')
  }).catch(function (err) {
    log.error('admin_treadline migration rollback error:' + err)
  })
}
