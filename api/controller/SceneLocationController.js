'use strict'
const path = require('path')

const { SceneLocation } = require(path.join(__dirname, '..', 'models'))

class SceneLocationController {
  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await SceneLocation.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await SceneLocation.query().insert(rows[i])

        // update uuid to match web
        data = await SceneLocation.query()
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
  SceneLocationController
}
