'use strict'
const path = require('path')

const { Genre } = require(path.join(__dirname, '..', 'models'))

class GenreController {
  static async save (data) {
    const saveGenre = await Genre.query().upsertGraph([data]).first()

    return saveGenre
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await Genre.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await Genre.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  GenreController
}
