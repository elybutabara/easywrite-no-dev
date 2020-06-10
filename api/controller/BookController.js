'use strict'
const path = require('path')

const { User, Book, BookGenre } = require(path.join(__dirname, '..', 'models'))

class BookController {
  static async getAllBooksByUserId (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const books = Book.query()
      .withGraphJoined('book_genre_collection')
      .withGraphJoined('genre')
      .where('author_id', user.author.uuid)
      .whereNull('books.deleted_at')
      // .whereNull('book_genre_collection.deleted_at')

    return books
  }

  static getAllBookGenres () {
    const genres = BookGenre.query()

    return genres
  }

  static getBookById (bookId) {
    /*
    * User modifyGraph to add condition for the related table
    * using whereNull directly to query pointing to relatedColumn will return NULL if related table return is NULL
    * */
    const book = Book.query().findById(bookId)
      .withGraphJoined('book_genre_collection')
      // .whereNull('book_genre_collection.deleted_at')
      .modifyGraph('book_genre_collection', builder => {
        builder.whereNull('deleted_at')
      })

    return book
  }

  static async save (data) {
    const saveBook = await Book.query().upsertGraph([data]).first()

    const book = Book.query()
      .withGraphJoined('genre')
      .findById(saveBook.uuid)

    return book
  }

  static async delete (bookId) {
    const book = await Book.query().softDeleteById(bookId)

    return book
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const rows = Book.query()
      .where('author_id', user.author.uuid)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await Book.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Book.query().insert(row)

      // update uuid to match web
      data = await Book.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  BookController
}
