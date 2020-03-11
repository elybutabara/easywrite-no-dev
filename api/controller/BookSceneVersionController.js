'use strict'
const path = require('path')

const { BookSceneVersion } = require(path.join(__dirname, '..', 'models'))

class BookSceneVersionController {
  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await BookSceneVersion.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await BookSceneVersion.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  BookSceneVersionController
}
