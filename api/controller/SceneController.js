'use strict'
const path = require('path')

const { Scene } = require(path.join(__dirname, '..', 'models'))

class SceneController {
  static getOtherScene (bookId) {
    var scenes = Scene.query()
      .where('book_id', bookId)
      .withGraphJoined('scene_version', {maxBatchSize: 1})
      .whereRaw('chapter_id IS NULL OR chapter_id = ?', [0])
      .whereNull('book_scenes.deleted_at')

    return scenes
  }

  static async save (data) {
    const upsertGraphOptions = {
      relate: ['scene_version'],
      noDelete: ['scene_version'],
      update: ['scene_version']
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

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await Scene.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await Scene.query().insert(rows[i])

        // update uuid to match web
        data = await Scene.query()
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
  SceneController
}
