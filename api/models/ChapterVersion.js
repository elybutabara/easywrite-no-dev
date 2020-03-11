'use strict'

const { BaseModel } = require('./BaseModel')

class ChapterVersion extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_chapter_versions'
  }

  static get idColumn () { return ['uuid'] }
}

module.exports = {
  ChapterVersion
}
