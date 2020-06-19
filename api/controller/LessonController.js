'use strict'
const path = require('path')

const { Lesson } = require(path.join(__dirname, '..', 'models'))

class LessonController {
  static async getAllByCourseId (param) {
    let lessons = Lesson.query()
      .where('course_id', param.courseID)
      .withGraphJoined('lesson_documents')
    if (param.limit) {
      lessons.limit(param.limit)
    }
    return lessons
  }
  //
  // static getByLessonId (lessonId) {
  //   var lesson = Lesson.query()
  //     .withGraphJoined('lesson_documents')
  //     .findById(lessonId)
  //
  //   return lesson
  // }

  // static async save (data) {
  //   const saveItem = await Lesson.query().upsertGraph([data]).first()
  //
  //   const lesson = Lesson.query()
  //     .withGraphJoined('book')
  //     .findById(saveItem.uuid)
  //
  //   return lesson
  // }
  //
  // static async delete (lessonId) {
  //   const lesson = await Lesson.query().softDeleteById(lessonId)
  //
  //   return lesson
  // }

  // static async getSyncable (userId) {
  //   const user = await User.query()
  //     .findById(userId)
  //     .withGraphJoined('author', { maxBatchSize: 1 })
  //
  //   const books = await Book.query()
  //     .select('uuid')
  //     .where('author_id', user.author.uuid)
  //     .whereNull('books.deleted_at')
  //     // .where('books.updated_at', '>', user.synced_at)
  //
  //   var bookUUIDs = []
  //
  //   for (let i = 0; i < books.length; i++) {
  //     bookUUIDs.push(books[i].uuid)
  //   }
  //
  //   const rows = await Item.query()
  //     .whereIn('book_id', bookUUIDs)
  //     .where('updated_at', '>', user.synced_at)
  //
  //   return rows
  // }

  // static async sync (row) {
  //   var data = await Item.query()
  //     .patch(row)
  //     .where('uuid', '=', row.uuid)
  //
  //   if (!data || data === 0) {
  //     data = await Item.query().insert({
  //       uuid: row.uuid,
  //       book_id: row.book_id,
  //       itemname: row.itemname,
  //       description: row.description,
  //       AKA: row.AKA,
  //       tags: row.tags,
  //       pictures: row.pictures,
  //       created_at: row.created_at,
  //       updated_at: row.updated_at,
  //       deleted_at: row.deleted_at,
  //       from_local: row.from_local
  //     })
  //     // update uuid to match web
  //     data = await Item.query()
  //       .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
  //       .where('uuid', '=', data.uuid)
  //   }
  //
  //   return data
  // }
}

module.exports = {
  LessonController
}
