'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Item extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_items'
  }

  static relationMappings = {
    book: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'book_items.book_id',
        to: 'books.uuid'
      }
    }
  }
}

module.exports = {
  Item
}
