'use strict'
const path = require('path')

const { Webinar, User } = require(path.join(__dirname, '..', 'models'))

class WebinarController {
  static async getAllByCourseId (param) {
    let webinars = Webinar.query()
      .where('course_id', param.courseID)
      .withGraphJoined('webinar_presenters')
    if (param.limit) {
      webinars.limit(param.limit)
    }
    return webinars
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const rows = await Webinar.query()
      .select('webinars.*')
      .join('courses', 'courses.uuid', 'webinars.course_id')
      .join('packages', 'packages.course_id', 'courses.uuid')
      .join('courses_taken', 'courses_taken.package_id', 'packages.uuid')
      .where('courses_taken.user_id', user.uuid)
      .where('webinars.updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      course_id: row.course_id,
      title: row.title,
      description: row.description,
      start_date: row.start_date,
      image: row.image,
      webinar_id: row.webinar_id,
      set_as_replay: row.set_as_replay,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at
    }

    var data = await Webinar.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Webinar.query().insert(columns)

      // update uuid to match web
      data = await Webinar.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  WebinarController
}
