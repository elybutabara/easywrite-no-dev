const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('book_items', 'picture_updated_at').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_items', function (table) {
        table.integer('picture_updated_at').after('pictures')
      }).then(function () {
        log.info('Migration book_items new column picture_updated_at : success')
      }).catch(function (err) {
        log.error('Migration book_items new column picture_updated_at : error:' + err)
      })
    }
  })


  await knex.schema.hasColumn('book_characters', 'picture_updated_at').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_characters', function (table) {
        table.integer('picture_updated_at').after('picture')
      }).then(function () {
        log.info('Migration book_characters new column picture_updated_at : success')
      }).catch(function (err) {
        log.error('Migration book_characters new column picture_updated_at : error:' + err)
      })
    }
  })

  await knex.schema.hasColumn('book_locations', 'picture_updated_at').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_locations', function (table) {
        table.integer('picture_updated_at').after('pictures')
      }).then(function () {
        log.info('Migration book_locations new column picture_updated_at : success')
      }).catch(function (err) {
        log.error('Migration book_locations new column picture_updated_at : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasColumn('book_items', 'picture_updated_at').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_items', function (table) {
        table.dropColumn('picture_updated_at')
      }).then(function () {
        log.info('Migration book_items drop column picture_updated_at : success')
      }).catch(function (err) {
        log.error('Migration book_items drop column picture_updated_at  : error:' + err)
      })
    }
  })

  await knex.schema.hasColumn('book_characters', 'picture_updated_at').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_characters', function (table) {
        table.dropColumn('picture_updated_at')
      }).then(function () {
        log.info('Migration book_characters drop column picture_updated_at : success')
      }).catch(function (err) {
        log.error('Migration book_characters drop column picture_updated_at  : error:' + err)
      })
    }
  })


  await knex.schema.hasColumn('book_locations', 'picture_updated_at').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_locations', function (table) {
        table.dropColumn('picture_updated_at')
      }).then(function () {
        log.info('Migration book_locations drop column picture_updated_at : success')
      }).catch(function (err) {
        log.error('Migration book_locations drop column picture_updated_at  : error:' + err)
      })
    }
  })
}
