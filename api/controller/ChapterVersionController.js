'use strict'
const path = require('path')

const { ChapterVersion } = require(path.join(__dirname, '..', 'models'))

class ChapterVersionController {
  static getAllChapterVersionsByChapterId (chapterId) {
    var version = ChapterVersion.query()
      .where('chapter_id', chapterId)
      .whereNull('deleted_at')
      .orderBy('id', 'asc')

    return version
  }

  static async save (data) {
    const chapterVersion = await ChapterVersion.query().upsertGraphAndFetch([data]).first()

    return chapterVersion
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await ChapterVersion.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await ChapterVersion.query().insert(rows[i])

        // update uuid to match web
        data = await ChapterVersion.query()
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
  ChapterVersionController
}
