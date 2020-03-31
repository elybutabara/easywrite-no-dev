'use strict'
const path = require('path')

const { Chapter, Scene } = require(path.join(__dirname, '..', 'models'))

class ChapterController {
  static getAllByBookId (param) {
    var chapters = Chapter.query()
      .where('book_id', param.bookId)
      .where('title', 'like', '%' + param.search + '%')
      .withGraphJoined('chapter_version', {maxBatchSize: 1})
      .whereNull('book_chapters.deleted_at')

    return chapters
  }

  static getChapterById (chapterId) {
    const chapter = Chapter.query().findById(chapterId)
      .withGraphJoined('chapter_version', {maxBatchSize: 1})
      .orderBy('chapter_version.id')

    return chapter
  }

  static async getAll () {
    return Chapter.query()
      .whereNull('deleted_at')
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

  static async delete (chapterId) {
    const chapter = await Chapter.query().softDeleteById(chapterId)

    await Scene.query()
      .where('chapter_id', chapterId)
      .patch({
        chapter_id: null
      })

    return chapter
  }

  static async sync (row) {
    var data = await Chapter.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Chapter.query().insert(row)

      // update uuid to match web
      data = await Chapter.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  ChapterController
}
