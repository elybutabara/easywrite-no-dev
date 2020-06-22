'use strict'
const path = require('path')

const { Lesson, User, CoursesTaken, LessonDocument } = require(path.join(__dirname, '..', 'models'))

class LessonDocumentController {
  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const courseTaken = await CoursesTaken.query()
      .select('uuid')
      .where('user_id', user.uuid)
    // .whereNull('books.deleted_at')
    // .where('books.updated_at', '>', user.synced_at)

    var coursesUUIDs = []

    for (let i = 0; i < courseTaken.length; i++) {
      coursesUUIDs.push(courseTaken[i].course.uuid)
    }

    const lessons = await Lesson.query()
      .whereIn('uuid', coursesUUIDs)

    let lessonsUUIDs = []

    for (let i = 0; i < lessons.length; i++) {
      lessonsUUIDs.push(lessons[i].uuid)
    }

    const rows = await LessonDocument.query()
      .whereIn('uuid', lessonsUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await LessonDocument.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await LessonDocument.query().insert({
        uuid: row.uuid,
        lesson_id: row.lesson_id,
        title: row.title,
        name: row.name,
        document: row.document,
        created_at: row.created_at,
        updated_at: row.updated_at
      })
      // update uuid to match web
      data = await LessonDocument.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  LessonDocumentController
}
