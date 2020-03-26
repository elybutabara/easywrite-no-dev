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

  static async sync (row) {
    var data = await ChapterVersion.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await ChapterVersion.query().insert(row)

      // update uuid to match web
      data = await ChapterVersion.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  ChapterVersionController
}
