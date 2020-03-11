'use strict'
const path = require('path')

const { BookSceneLocation } = require(path.join(__dirname, '..', 'models'))

class BookSceneLocationController {
  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await BookSceneLocation.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await BookSceneLocation.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  BookSceneLocationController
}
