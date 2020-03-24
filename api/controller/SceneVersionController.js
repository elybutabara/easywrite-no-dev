'use strict'
const path = require('path')

const { SceneVersion } = require(path.join(__dirname, '..', 'models'))

class SceneVersionController {
  static getAllSceneVersionsBySceneId (sceneId) {
    var version = SceneVersion.query()
      .where('book_scene_id', sceneId)
      .whereNull('deleted_at')
      .orderBy('id', 'asc')

    return version
  }

  static async save (data) {
    const sceneVersion = await SceneVersion.query().upsertGraphAndFetch([data]).first()

    return sceneVersion
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await SceneVersion.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await SceneVersion.query().insert(rows[i])

        // update uuid to match web
        data = await SceneVersion.query()
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
  SceneVersionController
}
