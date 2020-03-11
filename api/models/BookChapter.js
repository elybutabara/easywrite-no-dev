'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class BookChapter extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_chapters'
  }

  static get idColumn () { return ['uuid'] }

    static relationMappings = {
      chapter_version: {
        relation: BaseModel.HasManyRelation,
        modelClass: path.join(__dirname, 'ChapterVersion'),
        join: {
          from: 'book_chapters.uuid',
          to: 'chapter_versions.chapter_id'
        }
      }
    };
}

module.exports = {
  BookChapter
}
