'use strict'
const path = require('path')
const moment = require('moment')

const { AssignmentManuscript } = require(path.join(__dirname, '..', 'models'))

class AssignmentManuscriptController {
  static async getAssignmentManuscript (assignmentUuid) {
    const assignmentManuscript = await AssignmentManuscript.query()
      .whereNull('deleted_at')
      .where('assignment_id', assignmentUuid).first()

    return assignmentManuscript
  }
  static async save (data) {
    if (data.updated_at !== 'undefined' && data.updated_at !== null) {
      data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss').toString()
    }

    const saveAssignmentManuscript = await AssignmentManuscript.query().upsertGraph([data]).first()

    const assignmentManuscript = AssignmentManuscript.query()
      .findById(saveAssignmentManuscript.uuid)

    return assignmentManuscript
  }
  static async delete (manuscriptId) {
    const assignmentManuscript = await AssignmentManuscript.query().deleteById(manuscriptId)

    return assignmentManuscript
  }
}

module.exports = {
  AssignmentManuscriptController
}
