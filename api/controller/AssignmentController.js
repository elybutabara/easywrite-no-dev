'use strict'
const path = require('path')
const moment = require('moment')

// eslint-disable-next-line no-unused-vars
const { Assignment } = require(path.join(__dirname, '..', 'models'))

class AssignmentController {
  static async getAssignments (data) {
    const queryBuilder = Assignment.query()
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
}

module.exports = {
  AssignmentController
}
