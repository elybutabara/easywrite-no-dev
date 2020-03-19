'use strict'
const path = require('path')

const { SceneCharacter } = require(path.join(__dirname, '..', 'models'))

class SceneCharacterController {
  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await SceneCharacter.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await SceneCharacter.query().insert(rows[i])

        // update uuid to match web
        data = await SceneCharacter.query()
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
  SceneCharacterController
}
