'use strict'
const path = require('path')

const { BookLocation } = require(path.join(__dirname, '..', 'models'))

class BookLocationController {
  static getAllByBookId (bookId) {
    var locations = BookLocation.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')

    return locations
  }

  static async save (data) {
    const save = await BookLocation.query().upsertGraph([data]).first()
    return save
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await BookLocation.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await BookLocation.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  BookLocationController
}
