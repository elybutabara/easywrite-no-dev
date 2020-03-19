'use strict'

const { BaseModel } = require('./BaseModel')

class ChapterVersion extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_chapter_versions'
  }
}

module.exports = {
  ChapterVersion
}
