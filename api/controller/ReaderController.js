'use strict'
const path = require('path')
// const moment = require('moment')

const { Book, User, Reader } = require(path.join(__dirname, '..', 'models'))

class ReaderController {
  static async getAllBooksIReadByUserId (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const read = await Reader.query()
      .select('book_readers.book_id')
      .where('book_readers.author_id', user.author.uuid)
      .whereNull('book_readers.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var bookUUIDs = []

    for (let i = 0; i < read.length; i++) {
      bookUUIDs.push(read[i].book_id)
    }

    console.log('bookUUIDs')
    console.log(bookUUIDs)

    const books = Book.query()
      .withGraphJoined('book_genre_collection')
      .withGraphJoined('genre')
      .whereIn('books.uuid', bookUUIDs)
      .whereNull('books.deleted_at')
      .whereNull('book_genre_collection.deleted_at')

    return books
  }

  static getAllByBookId (param) {
    var readers = Reader.query()
      .where('book_id', param.bookId)
      .where('fullname', 'like', '%' + param.search + '%')
      .withGraphJoined('book')
      .whereNull('book_characters.deleted_at')

    return readers
  }

  static getByreaderId (readerId) {
    var reader = Reader.query()
      .withGraphJoined('book')
      .findById(readerId)

    return reader
  }

  static async save (data) {
    const saveReaders = await Reader.query().upsertGraph([data]).first()

    const reader = Reader.query()
      .withGraphJoined('book')
      .findById(saveReaders.uuid)

    return reader
  }

  static async delete (readerId) {
    const reader = await Reader.query().softDeleteById(readerId)

    return reader
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    console.log('READERS ' + userId)
    const rows = await Reader.query()
      .where('author_id', user.author.uuid)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await Reader.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Reader.query().insert(row)

      // update uuid to match web
      data = await Reader.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  ReaderController
}
