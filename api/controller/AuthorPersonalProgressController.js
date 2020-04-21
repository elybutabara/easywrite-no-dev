'use strict'
const path = require('path')
const moment = require('moment')

// eslint-disable-next-line no-unused-vars
const { AuthorPersonalProgress } = require(path.join(__dirname, '..', 'models'))

class AuthorPersonalProgressController {
  static async getAuthorPersonalProgress (data) {
    const queryBuilder = AuthorPersonalProgress.query()
      .where('author_id', data.authorId)
      .where('relation_id', data.relationId)
      .where('is_for', data.isFor)
      .whereNull('deleted_at')

    if (data.date === 'today') {
      queryBuilder.where('created_at', 'like', moment().format('YYYY-MM-DD').toString() + '%')
    }

    let authorPersonalProgress = await queryBuilder.orderBy('created_at', 'DESC').first()

    return authorPersonalProgress
  }

  static async getAuthorPersonalProgressWordsCount (authorId, date) {
    const queryBuilder = AuthorPersonalProgress.query()
      .sum('total_words as words_count')
      .where('author_id', authorId)
      .whereNull('deleted_at')

    if (date === 'today') {
      queryBuilder.where('created_at', 'like', moment().format('YYYY-MM-DD').toString() + '%')
    } else if (date === 'monthly') {
      queryBuilder.where('created_at', 'like', moment().format('YYYY-MM-').toString() + '%')
    } else if (date === 'yearly') {
      queryBuilder.where('created_at', 'like', moment().format('YYYY-').toString() + '%')
    }

    let authorPersonalProgress = await queryBuilder.orderBy('created_at', 'DESC').first()

    return authorPersonalProgress
  }

  static async save (data) {
    const saveAuthorPersonalProgress = await AuthorPersonalProgress.query().upsertGraph([data]).first()

    return saveAuthorPersonalProgress
  }
}

module.exports = {
  AuthorPersonalProgressController
}
