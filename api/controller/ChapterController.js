'use strict'
const path = require('path')
const Knex = require('knex')
const { Model } = require('objection')

const connection = require(path.join('../../src/knexfile'))[process.env.NODE_ENV]
const knexConnection = Knex(connection)

const { Chapter } = require(path.join(__dirname, '..', 'models'))

Model.knex(knexConnection)

class ChapterController {
  static async getChapterByBookId (bookId) {
    var chapters = Chapter.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')

    return chapters
  }

  static async getAll () {
    return Chapter.query()
      .whereNull('deleted_at')

    // console.log(chapters)
    // return chapters[0]
  }
}

module.exports = {
  ChapterController
}
