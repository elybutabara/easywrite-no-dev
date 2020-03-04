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
}

module.exports = {
  SceneController
}
