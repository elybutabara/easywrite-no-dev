const log = require('electron-log')

exports.up = async function(knex) {
    await knex.schema.hasColumn('authors', 'deleted_at').then(async (exists) => {
        if (!exists) {
            await knex.schema.table('authors', function (table) {
                table.text('deleted_at')
            }).then(function () {
                log.info('Migration authors deleted_at new column comments : success')
            }).catch(function (err) {
                log.error('Migration authors deleted_at new column comments  : error:' + err)
            })
        }
    })
};

exports.down = async function(knex) {
    await knex.schema.hasColumn('authors', 'deleted_at').then(async (exists) => {
        if (exists) {
          await knex.schema.table('authors', function (table) {
            table.dropColumn('deleted_at')
          }).then(function () {
            log.info('Migration authors deleted_at drop column comments : success')
          }).catch(function (err) {
            log.error('Migration authors deleted_at drop column comments  : error:' + err)
          })
        }
      })
};
