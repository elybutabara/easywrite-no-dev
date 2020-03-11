'use strict'
const path = require('path')

const { BookSceneItem } = require(path.join(__dirname, '..', 'models'))

class BookSceneItemController {
  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await BookSceneItem.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await BookSceneItem.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  BookSceneItemController
}
