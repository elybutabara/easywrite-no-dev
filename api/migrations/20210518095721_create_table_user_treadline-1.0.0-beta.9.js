const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */
  await knex.schema.createTable('user_treadline', function (t) {
    t.increments('id')
    t.string('uuid', 255)
    t.string('user_id', 255)
    t.string('book_id', 255)
    t.text('answer_1')
    t.text('answer_2')
    t.text('answer_3')
    t.text('answer_4')
    t.text('answer_5')
    t.text('answer_6')
    t.text('answer_7')
    t.text('answer_8')
    t.text('answer_9')
    t.text('answer_10')
    t.text('answer_11')
    t.text('ending')
    t.timestamps()
    t.dateTime('deleted_at')
  }).then(function () {
    log.info('user_treadline migration : success')
  }).catch(function (err) {
    log.error('user_treadline migration : error:' + err)
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('user_treadline').then(function () {
    log.info('user_treadline migration rollback successfuly')
  }).catch(function (err) {
    log.error('user_treadline migration rollback error:' + err)
  })
}
