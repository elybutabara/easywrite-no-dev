'use strict'
const path = require('path')

const { Book, Chapter, ChapterFeedback, Reader, User } = require(path.join(__dirname, '..', 'models'))

class ChapterFeedbackController {
  static getAllFeedbackByChapterId (chapterId) {
    var feedbacks = ChapterFeedback.query()
      .where('chapter_id', chapterId)
      .withGraphJoined('chapter_feedback_responses', {maxBatchSize: 1})
      .orderBy('id', 'asc')

    return feedbacks
  }

  static async save (data) {
    const feedback = await ChapterFeedback.query().upsertGraphAndFetch([data]).first()

    var row = ChapterFeedback.query()
      .where('book_chapter_feedbacks.uuid', feedback.uuid)
      .withGraphJoined('chapter_feedback_responses', {maxBatchSize: 1})
      .first()

    return row
  }

  static async updateStatus (row) {
    var data = await ChapterFeedback.query()
      .patch({ mark_as_finished: !row.finished })
      .where('uuid', '=', row.uuid)

    return data
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }

    const booksIRead = await Reader.query()
      .where('author_id', user.author.uuid)

    for (let i = 0; i < booksIRead.length; i++) {
      bookUUIDs.push(booksIRead[i].book_id)
    }

    const chapters = await Chapter.query()
      .whereIn('book_id', bookUUIDs)

    var chapterUUIDs = []

    for (let i = 0; i < chapters.length; i++) {
      chapterUUIDs.push(chapters[i].uuid)
    }

    const rows = await ChapterFeedback.query()
      .whereIn('chapter_id', chapterUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await ChapterFeedback.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await ChapterFeedback.query().insert(row)

      // update uuid to match web
      data = await ChapterFeedback.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  ChapterFeedbackController
}
