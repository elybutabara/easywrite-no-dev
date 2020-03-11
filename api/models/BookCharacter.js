'use strict'

const { BaseModel } = require('./BaseModel')

class BookCharacter extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_characters'
  }

  static get idColumn () { return ['uuid'] }
}

module.exports = {
  BookCharacter
}
