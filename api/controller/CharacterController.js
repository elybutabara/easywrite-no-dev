'use strict'
const path = require('path')

const { Character } = require(path.join(__dirname, '..', 'models'))

class CharacterController {
  static getAllByBookId (bookId) {
    var characters = Character.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')

    return characters
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await Character.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await Character.query().insert(rows[i])

        // update uuid to match web
        data = await Character.query()
          .patch({ 'uuid': rows[i].uuid })
          .where('uuid', '=', data.uuid)

        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  CharacterController
}
