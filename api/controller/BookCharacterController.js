'use strict'
const path = require('path')

const { BookCharacter } = require(path.join(__dirname, '..', 'models'))

class BookCharacterController {
  static getAllByBookId (bookId) {
    var characters = BookCharacter.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')

    return characters
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await BookCharacter.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await BookCharacter.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  BookCharacterController
}
