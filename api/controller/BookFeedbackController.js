'use strict'
const path = require('path')

const { Book, BookFeedback, Reader, User } = require(path.join(__dirname, '..', 'models'))

class BookFeedbackController {
  static getAllFeedbackByBookId (bookId) {
    var feedbacks = BookFeedback.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')
      .orderBy('id', 'asc')

    return feedbacks
  }

  static async save (data) {
    const feedback = await BookFeedback.query().upsertGraphAndFetch([data]).first()
    return feedback
  }

  static async updateStatus (row) {
    var data = await BookFeedback.query()
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
      .whereNull('books.deleted_at')

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }

    const booksIRead = await Reader.query()
      .where('author_id', user.author.uuid)

    for (let i = 0; i < booksIRead.length; i++) {
      bookUUIDs.push(booksIRead[i].book_id)
    }

    const rows = await BookFeedback.query()
      .whereIn('book_id', bookUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await BookFeedback.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await BookFeedback.query().insert(row)

      // update uuid to match web
      data = await BookFeedback.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  BookFeedbackController
}
