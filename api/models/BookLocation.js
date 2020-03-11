'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class BookLocation extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_locations'
  }

  static relationMappings = {
    book: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'locations.book_id',
        to: 'books.id'
      }
    }
  }

  static get idColumn () { return ['uuid'] }
}

module.exports = {
  BookLocation
}
