'use strict'
const path = require('path')

const { BookChapter } = require(path.join(__dirname, '..', 'models'))

class BookChapterController {
  static getAllByBookId (bookId) {
    var chapters = BookChapter.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')

    return chapters
  }
  static async getAll () {
    return BookChapter.query()
      .whereNull('deleted_at')

    // console.log(chapters)
    // return chapters[0]
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await BookChapter.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await BookChapter.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  BookChapterController
}
