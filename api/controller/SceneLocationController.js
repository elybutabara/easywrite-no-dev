'use strict'
const path = require('path')

const { SceneLocation } = require(path.join(__dirname, '..', 'models'))

class SceneLocationController {
  static async sync (row) {
    var data = await SceneLocation.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await SceneLocation.query().insert(row)

      // update uuid to match web
      data = await SceneLocation.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  SceneLocationController
}
