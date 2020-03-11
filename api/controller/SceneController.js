'use strict'
const path = require('path')

const { Scene } = require(path.join(__dirname, '..', 'models'))

class SceneController {
  static getOtherScene (bookId) {
    var scenes = Scene.query()
      .where('book_id', bookId)
      .whereRaw('chapter_id IS NULL OR chapter_id = ?', [0])
      .whereNull('deleted_at')

    return scenes
  }
  static getAllSceneByChapterId (chapterId) {
    var scenes = Scene.query()
      .where('chapter_id', chapterId)
      .whereNull('deleted_at')

    return scenes
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
