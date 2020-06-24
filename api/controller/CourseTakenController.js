'use strict'
const path = require('path')

const { CoursesTaken, User } = require(path.join(__dirname, '..', 'models'))

class CourseTakenController {
  static async getAllAssignmentByUserId (param) {
    var course = CoursesTaken.query()
      .where('user_id', param.userID)
      .withGraphJoined('package')
      .withGraphJoined('course')

    return course
  }
}

module.exports = {
  CourseTakenController
}
