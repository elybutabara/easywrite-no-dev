'use strict'
const path = require('path')

// eslint-disable-next-line no-unused-vars
const { BookChapterHistory } = require(path.join(__dirname, '..', 'models'))

class BookChapterHistoryController {
  static async save (data) {
    const saveBookChapterHistory = await BookChapterHistory.query().upsertGraph([data]).first()

    return saveBookChapterHistory
  }
}

module.exports = {
  BookChapterHistoryController
}
