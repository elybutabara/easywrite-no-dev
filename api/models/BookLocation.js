'use strict'

const { BaseModel } = require('./BaseModel')

class BookLocation extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_locations'
  }

  static get idColumn () { return ['uuid'] }
}

module.exports = {
  BookLocation
}
