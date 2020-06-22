'use strict'
const path = require('path')

const { CoursesTaken, Package, User } = require(path.join(__dirname, '..', 'models'))

class PackageCourseController {
  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const courseTaken = await CoursesTaken.query()
      .select('uuid')
      .where('user_id', user.uuid)
      // .whereNull('books.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var packageUUIDs = []

    for (let i = 0; i < courseTaken.length; i++) {
      packageUUIDs.push(courseTaken[i].package.uuid)
    }

    const rows = await Package.query()
      .whereIn('uuid', packageUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
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
