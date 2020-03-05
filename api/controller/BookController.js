'use strict'
const path = require('path')

const { User, Book, BookGenre } = require(path.join(__dirname, '..', 'models'))

class BookController {
  static async getAllBooksByUserId (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const books = Book.query()
      .withGraphJoined('genre')
      .where('author_id', user.author.id)
      .whereNull('books.deleted_at')

    return books
  }
  static getAllBookGenres () {
    const genres = BookGenre.query()

    return genres
  }
  static getBookById (bookId) {
    const book = Book.query().findById(bookId)
      .withGraphJoined('book_genre_collection')
      .withGraphJoined('genre')

    return book
  }
  static async save (data) {
    const saveBook = await Book.query().upsertGraph([data]).first()

    const book = Book.query()
      .withGraphJoined('genre')
      .findById(saveBook.id)

    return book
  }
}

module.exports = {
  BookController
}
