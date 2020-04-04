'use strict'
const path = require('path')

const { Book, Chapter, Scene, User } = require(path.join(__dirname, '..', 'models'))

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

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)
      .whereNull('books.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }

    const rows = await Chapter.query()
      .whereIn('book_id', bookUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
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
