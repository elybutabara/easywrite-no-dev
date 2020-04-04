'use strict'
const path = require('path')

const { Book, Scene, SceneLocation, User } = require(path.join(__dirname, '..', 'models'))

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

    const rows = await SceneLocation.query()
      .whereIn('book_scene_id', sceneUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
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
