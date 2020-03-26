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

  static async sync (row) {
    var data = await SceneVersion.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await SceneVersion.query().insert(row)

      // update uuid to match web
      data = await SceneVersion.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  SceneVersionController
}
