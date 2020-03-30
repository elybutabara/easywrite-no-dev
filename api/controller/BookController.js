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
      .whereNull('book_genre_collection.deleted_at')

    return books
  }

  static getAllBookGenres () {
    const genres = BookGenre.query()

    return genres
  }

  static getBookById (bookId) {
    const book = Book.query().findById(bookId)
      .withGraphJoined('book_genre_collection')
      .whereNull('book_genre_collection.deleted_at')

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

  static async sync (row) {
    var data = await Book.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Book.query().insert(row)

      // update uuid to match web
      data = await Book.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  BookController
}
