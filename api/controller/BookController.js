'use strict'
const path = require('path')

const { User, Book } = require(path.join(__dirname, '..', 'models'))

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
}

module.exports = {
  BookController
}
