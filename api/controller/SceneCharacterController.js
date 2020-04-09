'use strict'
const path = require('path')
const moment = require('moment')

const { Book, Scene, SceneCharacter, User } = require(path.join(__dirname, '..', 'models'))

class SceneCharacterController {
  static getAllSceneCharactersBySceneId (sceneId) {
    const sceneCharacter = SceneCharacter.query()
      .withGraphFetched('character')
      .where('book_scene_id', sceneId)
      .whereNull('book_scene_characters.deleted_at')

    return sceneCharacter
  }

  static async save (data) {
    const save = await SceneCharacter.query().upsertGraph([data])
      .withGraphFetched('scene')
      .withGraphFetched('character')
      .first()

    return save
  }

  static async saveBatch (data) {
    // eslint-disable-next-line no-unused-vars
    var items = await SceneCharacter.query()
      .patch({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString() })
      .where('book_scene_id', '=', data.book_scene_id)
      .whereNotIn('book_character_id', data.rows)

    var count = 0
    for (let i = 0; i < data.rows.length; i++) {
      var row = data.rows[i]

      // eslint-disable-next-line no-redeclare
      var saved = await SceneCharacter.query()
        .patch({ deleted_at: null, book_scene_id: data.book_scene_id, book_character_id: row })
        .where('book_scene_id', '=', data.book_scene_id)
        .where('book_character_id', '=', row)

      if (!saved || saved === 0) {
        saved = await SceneCharacter.query().insert({ book_scene_id: data.book_scene_id, book_character_id: row })
      }

      count++
    }

    return count
  }

  static async delete (sceneCharacterId) {
    const sceneCharacter = await SceneCharacter.query().softDeleteById(sceneCharacterId, {deleteWithRelated: false})

    return sceneCharacter
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

    const rows = await SceneCharacter.query()
      .whereIn('book_scene_id', sceneUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await SceneCharacter.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await SceneCharacter.query().insert(row)

      // update uuid to match web
      data = await SceneCharacter.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  SceneCharacterController
}
