'use strict'
const path = require('path')
const moment = require('moment')

const { Book, Scene, User } = require(path.join(__dirname, '..', 'models'))

class SceneController {
  static getOtherScene (param) {
    var scenes = Scene.query()
      .where('book_scenes.book_id', param.bookId)
      .withGraphJoined('scene_version', {maxBatchSize: 1})
      .whereNull('book_scenes.deleted_at')
      .whereRaw('chapter_id IS NULL OR chapter_id = 0')
      .orderBy('order')

    return scenes
  }

  static async sort (data) {
    var count = 0
    for (let i = 0; i < data.length; i++) {
      var row = data[i]
      // eslint-disable-next-line no-unused-vars
      var item = await Scene.query()
        .patch({ chapter_id: row.chapter_id, order: count })
        .where('uuid', '=', row.uuid)

      count++
    }

    return count
  }

  static async save (data) {
    const upsertGraphOptions = {
      relate: ['scene_version'],
      noDelete: ['scene_version'],
      update: ['scene_version']
    }

    if (data.updated_at !== 'undefined' && data.updated_at !== null) {
      data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss').toString()
    }

    if (data.scene_version.updated_at !== 'undefined' && data.scene_version.updated_at !== null) {
      data.scene_version.updated_at = moment().format('YYYY-MM-DD HH:mm:ss').toString()
    }

    const saveScene = await Scene.query().upsertGraph([data], upsertGraphOptions).first()

    const scene = Scene.query()
      .withGraphJoined('scene_version', {maxBatchSize: 1})
      .orderBy('scene_version.id')
      .findById(saveScene.uuid)

    return scene
  }

  static getAllSceneByChapterId (chapterId) {
    var scenes = Scene.query()
      .withGraphJoined('scene_version', {maxBatchSize: 1})
      .where('book_scenes.chapter_id', chapterId)
      .whereNull('book_scenes.deleted_at')
      .orderBy('order')

    return scenes
  }

  static getAllSceneWithRelationByChapterId (chapterId) {
    var scenes = Scene.query()
      .withGraphJoined('scene_character', {maxBatchSize: 1})
      .withGraphJoined('scene_location', {maxBatchSize: 1})
      .withGraphJoined('scene_item', {maxBatchSize: 1})
      .where('book_scenes.chapter_id', chapterId)
      .whereNull('book_scenes.deleted_at')
      .orderBy('order')

    return scenes
  }

  static getSceneById (sceneId) {
    const scene = Scene.query().findById(sceneId)
      .withGraphJoined('scene_version', {maxBatchSize: 1})
      .orderBy('scene_version.id')
      .withGraphJoined('scene_character')
      .orderBy('scene_character.id')

    return scene
  }

  static async delete (sceneId) {
    const scene = await Scene.query().softDeleteById(sceneId)

    return scene
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)
      // .whereNull('books.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }

    const rows = await Scene.query()
      .whereIn('book_id', bookUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await Scene.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Scene.query().insert(row)

      // update uuid to match web
      data = await Scene.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  SceneController
}
