'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class CoursesTaken extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'courses_taken'
  }

  static relationMappings = {
    package: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Package'),
      join: {
        from: 'courses_taken.package_id',
        to: 'packages.uuid'
      }
    },
    course: {
      relation: BaseModel.HasOneThroughRelation,
      modelClass: path.join(__dirname, 'Course'),
      join: {
        from: 'courses_taken.package_id',
        through: {
          from: 'packages.uuid',
          to: 'packages.course_id'
        },
        to: 'courses.uuid'
      },
      softDelete: true
    }
  }
}

module.exports = {
  CoursesTaken
}
