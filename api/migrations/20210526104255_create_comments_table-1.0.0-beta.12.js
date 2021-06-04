const log = require('electron-log')
exports.up = async function(knex) {
    await knex.schema.createTable('comments', function (t) {
        t.increments('id')
        t.string('uuid', 255)
        t.string('comment_id', 255).nullable().defaultTo(null);
        t.string('parent', 255)
        t.string('parent_id', 255)
        t.string('author_id', 255)
        t.integer('start_point')
        t.integer('end_point')
        t.text('comment').nullable();
        t.string('status').defaultTo('active');
        t.timestamps()
        t.dateTime('deleted_at')
    }).then(function () {
        log.info('comments migration : success')
    }).catch(function (err) {
        log.error('comments migration : error:' + err)
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTable('comments').then(function () {
        log.info('comments migration rollback successfuly')
    }).catch(function (err) {
        log.error('comments migration rollback error:' + err)
    })
};
