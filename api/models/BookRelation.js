'use strict'

const { BaseModel } = require('./BaseModel')

class BookRelation extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_relations'
  }

  static get idColumn () { return ['uuid'] }
}

module.exports = {
  BookRelation
}
