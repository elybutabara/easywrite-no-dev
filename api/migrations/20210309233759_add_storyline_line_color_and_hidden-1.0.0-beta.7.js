const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('book_characters', 'line_color').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_characters', function (table) {
        table.string('line_color')
        table.boolean('storyline_hidden')
      }).then(function () {
        log.info('Migration book_characters new column line_color  : success')
      }).catch(function (err) {
        log.error('Migration book_characters new column line_color   : error:' + err)
      })
    }
  })
  
  
  await knex.schema.hasColumn('book_locations', 'line_color').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_locations', function (table) {
        table.string('line_color')
        table.boolean('storyline_hidden')
      }).then(function () {
        log.info('Migration book_locations new column line_color  : success')
      }).catch(function (err) {
        log.error('Migration book_locations new column line_color   : error:' + err)
      })
    }
  })
  
  
  await knex.schema.hasColumn('book_items', 'line_color').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_items', function (table) {
        table.string('line_color')
        table.boolean('storyline_hidden')
      }).then(function () {
        log.info('Migration book_items new column line_color  : success')
      }).catch(function (err) {
        log.error('Migration book_items new column line_color   : error:' + err)
      })
    }
  })

  await knex.schema.hasColumn('book_scenes', 'storyline_hidden').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_scenes', function (table) {
        table.boolean('storyline_hidden')
      }).then(function () {
        log.info('Migration book_scenes new column line_color  : success')
      }).catch(function (err) {
        log.error('Migration book_scenes new column line_color   : error:' + err)
      })
    }
  })

}

exports.down = async function (knex) {
  await knex.schema.hasColumn('book_characters', 'line_color').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_characters', function (table) {
        table.dropColumn('line_color')
        table.dropColumn('storyline_hidden')
      }).then(function () {
        log.info('Migration book_characters drop column line_color : success')
      }).catch(function (err) {
        log.error('Migration book_characters drop column line_color  : error:' + err)
      })
    }
  })
  await knex.schema.hasColumn('book_locations', 'line_color').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_locations', function (table) {
        table.dropColumn('line_color')
        table.dropColumn('storyline_hidden')
      }).then(function () {
        log.info('Migration book_locations drop column line_color : success')
      }).catch(function (err) {
        log.error('Migration book_locations drop column line_color  : error:' + err)
      })
    }
  })
  await knex.schema.hasColumn('book_items', 'line_color').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_items', function (table) {
        table.dropColumn('line_color')
        table.dropColumn('storyline_hidden')
      }).then(function () {
        log.info('Migration book_items drop column line_color : success')
      }).catch(function (err) {
        log.error('Migration book_items drop column line_color  : error:' + err)
      })
    }
  })
  await knex.schema.hasColumn('book_scenes', 'storyline_hidden').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_scenes', function (table) {
        table.dropColumn('storyline_hidden')
      }).then(function () {
        log.info('Migration book_scenes drop column storyline_hidden : success')
      }).catch(function (err) {
        log.error('Migration book_scenes drop column storyline_hidden  : error:' + err)
      })
    }
  })
}


