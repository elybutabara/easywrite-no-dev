'use strict'
const path = require('path')

const { SceneItem } = require(path.join(__dirname, '..', 'models'))

class SceneItemController {
  static getAllSceneItemsBySceneId (sceneId) {
    const sceneItem = SceneItem.query()
      .withGraphFetched('item')
      .where('book_scene_id', sceneId)
      .whereNull('book_scene_items.deleted_at')

    return sceneItem
  }

  static async delete (sceneItemId) {
    const sceneItem = await SceneItem.query().softDeleteById(sceneItemId)

    return sceneItem
  }

  static async save (data) {
    const save = await SceneItem.query().upsertGraph([data])
      .withGraphFetched('scene')
      .withGraphFetched('item')
      .first()

    return save
  }

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
