'use strict'

const { BaseModel } = require('./BaseModel')

class BookItem extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_items'
  }

  static get idColumn () { return ['uuid'] }
}

module.exports = {
  BookItem
}
