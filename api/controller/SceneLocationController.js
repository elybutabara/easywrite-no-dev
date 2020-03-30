'use strict'
const path = require('path')

const { SceneLocation } = require(path.join(__dirname, '..', 'models'))

class SceneLocationController {
  static getAllSceneLocationsBySceneId (sceneId) {
    const sceneLocation = SceneLocation.query()
      .withGraphFetched('location')
      .where('book_scene_id', sceneId)
      .whereNull('book_scene_locations.deleted_at')

    return sceneLocation
  }

  static async save (data) {
    const save = await SceneLocation.query().upsertGraph([data])
      .withGraphFetched('scene')
      .withGraphFetched('location')
      .first()

    return save
  }

  static async delete (sceneLocationId) {
    const sceneLocation = await SceneLocation.query().softDeleteById(sceneLocationId, {deleteWithRelated: false})

    return sceneLocation
  }

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
