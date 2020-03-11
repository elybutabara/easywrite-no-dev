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

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await Chapter.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await Chapter.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  ChapterController
}
