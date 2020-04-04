'use strict'
const path = require('path')

const { Book, Scene, SceneItem, User } = require(path.join(__dirname, '..', 'models'))

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

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)
      .whereNull('books.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }

    const scenes = await Scene.query()
      .whereIn('book_id', bookUUIDs)
      .whereNull('deleted_at')

    var sceneUUIDs = []

    for (let i = 0; i < scenes.length; i++) {
      sceneUUIDs.push(scenes[i].uuid)
    }

    const rows = await SceneItem.query()
      .whereIn('book_scene_id', sceneUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
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
