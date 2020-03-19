'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Character extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_characters'
  }

  static relationMappings = {
    book: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'book_characters.book_id',
        to: 'books.uuid'
      }
    }
  }
}

module.exports = {
  Character
}
