'use strict'
const path = require('path')

const { Book, Chapter, ChapterFeedback, ChapterFeedbackResponse, Reader, User } = require(path.join(__dirname, '..', 'models'))

class ChapterFeedbackResponseController {
  static getAllFeedbackByChapterFeedbackId (bookId) {
    var feedbacks = ChapterFeedbackResponse.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')
      .orderBy('id', 'asc')

    return feedbacks
  }

  static async save (data) {
    const feedback = await ChapterFeedbackResponse.query().upsertGraphAndFetch([data]).first()

    return feedback
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

    const feedbacks = await ChapterFeedback.query()
      .whereIn('chapter_id', chapterUUIDs)

    var chapterFeedbackUUIDs = []

    for (let i = 0; i < feedbacks.length; i++) {
      chapterFeedbackUUIDs.push(feedbacks[i].uuid)
    }

    const rows = await ChapterFeedbackResponse.query()
      .whereIn('chapter_feedback_id', chapterFeedbackUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await ChapterFeedbackResponse.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await ChapterFeedbackResponse.query().insert(row)

      // update uuid to match web
      data = await ChapterFeedbackResponse.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  ChapterFeedbackResponseController
}
