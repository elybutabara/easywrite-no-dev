'use strict'
const path = require('path')

const { CoursesTaken, Course, User } = require(path.join(__dirname, '..', 'models'))

class CourseTakenController {
  static async getAllByUserId (param) {
    let courseTaken = CoursesTaken.query()
      .where('user_id', param.userID)
      .withGraphJoined('package')
      .withGraphJoined('course')
    if (param.limit) {
      courseTaken.limit(param.limit)
    }
    return courseTaken
  }

  static getByCourseId (courseId) {
    let courseTaken = CoursesTaken.query()
      .withGraphJoined('package')
      .withGraphJoined('course')
      .where('course_id', courseId)
    return courseTaken
  }

  static getByCourseUUID (courseUUID) {
    let courseTaken = CoursesTaken.query()
      .withGraphJoined('package')
      .withGraphJoined('course')
      .where('uuid', courseUUID)
    return courseTaken
  }

  static async save (data) {
    const saveCourseTaken = await CoursesTaken.query().upsertGraph([data]).first()
    return this.getByCourseUUID(saveCourseTaken.uuid)
  }

  static async delete (courseId) {
    const course = await Course.query().softDeleteById(courseId)

    return course
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const courseTaken = await CoursesTaken.query()
      .select('uuid')
      .where('user_id', user.uuid)
      // .whereNull('books.deleted_at') // no deleted_at column
      .where('updated_at', '>', user.synced_at)

    return courseTaken
  }

  static async sync (row) {
    var data = await CoursesTaken.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await CoursesTaken.query().insert({
        uuid: row.uuid,
        user_id: row.user_id,
        package_id: row.package_id,
        is_active: row.is_active,
        started_at: row.started_at,
        start_date: row.start_date,
        end_date: row.end_date,
        access_lessons: row.access_lessons,
        years: row.years,
        sent_renew_email: row.sent_renew_email,
        is_free: row.is_free,
        created_at: row.created_at,
        updated_at: row.updated_at
      })
      // update uuid to match web
      data = await CoursesTaken.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  CourseTakenController: CourseTakenController
}
