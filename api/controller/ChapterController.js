'use strict'
const path = require('path')

const { Chapter } = require(path.join(__dirname, '..', 'models'))

class ChapterController {
  static getAllByBookId (bookId) {
    var chapters = Chapter.query()
      .where('book_id', bookId)
      .withGraphJoined('chapter_version', {maxBatchSize: 1})
      .whereNull('book_chapters.deleted_at')

    return chapters
  }

  static getChapterById (chapterId) {
    const chapter = Chapter.query().findById(chapterId)
      .withGraphJoined('chapter_version', {maxBatchSize: 1})

    return chapter
  }

  static async getAll () {
    return Chapter.query()
      .whereNull('deleted_at')

    // console.log(chapters)
    // return chapters[0]
  }

  static async save (data) {
    const upsertGraphOptions = {
      relate: ['chapter_version'],
      noDelete: ['chapter_version'],
      update: ['chapter_version']
    }

    const saveChapter = await Chapter.query().upsertGraphAndFetch([data], upsertGraphOptions).first()

    const chapter = Chapter.query()
      .findById(saveChapter.uuid)
      .withGraphJoined('chapter_version', {maxBatchSize: 1})
      .orderBy('chapter_version.created_at', 'DESC')

    return chapter
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

        // update uuid to match web
        data = await Chapter.query()
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
  ChapterController
}
