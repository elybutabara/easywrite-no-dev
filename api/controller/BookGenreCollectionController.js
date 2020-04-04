'use strict'
const path = require('path')

const { Book, BookGenreCollection, User } = require(path.join(__dirname, '..', 'models'))

class BookGenreCollectionController {
  static async save (data) {
    const save = await BookGenreCollection.query().upsertGraph([data]).first()
    return save
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

    const rows = await BookGenreCollection.query()
      .whereIn('book_id', bookUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await BookGenreCollection.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await BookGenreCollection.query().insert(row)

      // update uuid to match web
      data = await BookGenreCollection.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  BookGenreCollectionController
}
