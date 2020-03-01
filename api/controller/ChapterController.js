'use strict'
const path = require('path')

const { Chapter } = require(path.join(__dirname, '..', 'models'))

class ChapterController {
  static getAllByBookId (bookId) {
    var chapters = Chapter.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')

    return chapters
  }
  static async getAll () {
    return Chapter.query()
      .whereNull('deleted_at')

    // console.log(chapters)
    // return chapters[0]
  }
}

module.exports = {
  ChapterController
}
