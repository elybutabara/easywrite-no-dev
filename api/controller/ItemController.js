'use strict'
const path = require('path')

const { Item } = require(path.join(__dirname, '..', 'models'))

class ItemController {
  static getAllByBookId (bookId) {
    var items = Item.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')

    return items
  }
}

module.exports = {
  ItemController
}
