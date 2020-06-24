'use strict'
const path = require('path')
const moment = require('moment')
// const { raw } = require('objection')

const { Assignment } = require(path.join(__dirname, '..', 'models'))

class AssignmentController {
  static async getUserAssignments (data) {
    // , raw('( SELECT assignment_manuscripts.* FROM assignment_manuscripts WHERE assignment_manuscripts.assignment_id = assignments.uuid )').as('assignment_manuscripts')
    const queryBuilder = Assignment.query()
      .select('assignments.*', 'courses.title as course_title', 'courses_taken.started_at as course_started_at')
      .join('courses', 'courses.uuid', 'assignments.course_id')
      .join('packages', 'packages.course_id', 'courses.uuid')
      .join('courses_taken', 'courses_taken.package_id', 'packages.uuid')
      .where('courses_taken.user_id', data.userId)
      .whereRaw("available_date <= '" + moment().format('YYYY-MM-DD').toString() + "' OR available_date IS NULL")
      .groupBy('assignments.id')

    let assignments = await queryBuilder.orderBy('assignments.created_at', 'DESC')

    return assignments
  }
}

module.exports = {
  AssignmentController
}
