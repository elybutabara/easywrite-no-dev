'use strict'
const path = require('path')

const { CoursesTaken, Package, User, PackageCourse } = require(path.join(__dirname, '..', 'models'))

class PackageCourseController {
  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    let courseTaken = await CoursesTaken.query()
      .where('user_id', user.uuid)
      .withGraphJoined('course')

    const courseUUIDs = []
    for (let i = 0; i < courseTaken.length; i++) {
      courseUUIDs.push(courseTaken[i].course.uuid)
    }

    let packages = await Package.query()
      .select('uuid')
      .whereIn('course_id', courseUUIDs)

    let packageUUIDs = []
    for (let i = 0; i < packages.length; i++) {
      packageUUIDs.push(packages[i].uuid)
    }

    let packageCourses = await PackageCourse.query()
      .whereIn('package_id', packageUUIDs)
      .where('updated_at', '>', user.synced_at)

    return packageCourses
  }

  static async sync (row) {
    var data = await Package.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Package.query().insert({
        package_id: row.package_id,
        included_package_id: row.included_package_id,
        created_at: row.created_at,
        updated_at: row.updated_at
      })
      // update uuid to match web
      data = await Package.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  PackageCourseController
}
