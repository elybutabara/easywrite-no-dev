'use strict'
const path = require('path')

const { Book, Scene, SceneVersion, User } = require(path.join(__dirname, '..', 'models'))

class SceneVersionController {
  static getAllSceneVersionsBySceneId (sceneId) {
    var version = SceneVersion.query()
      .where('book_scene_id', sceneId)
      .whereNull('deleted_at')
      .orderBy('id', 'asc')

    return version
  }

  static async save (data) {
    if (data.updated_at !== 'undefined' && data.updated_at !== null) {
      delete data.updated_at
    }

    const sceneVersion = await SceneVersion.query().upsertGraphAndFetch([data]).first()
    return sceneVersion
  }

  static async comment (data) {
    const sceneVersion = await SceneVersion.query().upsertGraphAndFetch([data]).first()
    console.log(data)

    return sceneVersion
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
      // .whereNull('deleted_at')

    var sceneUUIDs = []

    for (let i = 0; i < scenes.length; i++) {
      sceneUUIDs.push(scenes[i].uuid)
    }

    const rows = await SceneVersion.query()
      .whereIn('book_scene_id', sceneUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      book_scene_id: row.book_scene_id,
      content: row.content,
      change_description: row.change_description,
      comments: row.comments,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      from_local: row.from_local
    }

    var data = await SceneVersion.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await SceneVersion.query().insert(columns)

      // update uuid to match web
      data = await SceneVersion.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  SceneVersionController
}
