'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Location extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'locations'
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
}

module.exports = {
  Location
}
