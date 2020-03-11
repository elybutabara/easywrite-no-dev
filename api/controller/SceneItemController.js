'use strict'
const path = require('path')

const { SceneItem } = require(path.join(__dirname, '..', 'models'))

class SceneItemController {
  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await SceneItem.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await SceneItem.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  SceneItemController
}
