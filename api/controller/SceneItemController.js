'use strict'
const path = require('path')

const { SceneItem } = require(path.join(__dirname, '..', 'models'))

class SceneItemController {
  static async sync (row) {
    var data = await SceneItem.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await SceneItem.query().insert(row)

      // update uuid to match web
      data = await SceneItem.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  SceneItemController
}
