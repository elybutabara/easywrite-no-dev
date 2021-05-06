/* eslint-disable no-mixed-spaces-and-tabs */
'use strict'
const path = require('path')

const { Book, Chapter, Scene, User } = require(path.join(__dirname, '..', 'models'))

class ChapterController {
  static getAllByBookId (param) {
    var chapters = Chapter.query()
      .where('book_id', param.bookId)
      .where('title', 'like', '%' + param.search + '%')
      .withGraphJoined('chapter_version', {maxBatchSize: 1})
      .modifyGraph('chapter_version', builder => {
        builder.whereNull('deleted_at')
        builder.orderBy('created_at', 'ASC')
      })
      .whereNull('book_chapters.deleted_at')
      .orderBy('order')
      .orderBy('created_at')

    return chapters
  }

  static getAllByBookIdLatestChapterVersion (param) {
    var chapters = Chapter.query()
      .where('book_id', param.bookId)
      .where('title', 'like', '%' + param.search + '%')
      .withGraphJoined('chapter_version', {maxBatchSize: 1})
      .modifyGraph('chapter_version', builder => {
        builder.whereNull('deleted_at')
        builder.orderBy('id')
      })
      .whereNull('book_chapters.deleted_at')
      .orderBy('order')

    return chapters
  }

  static getChapterById (chapterId) {
    const chapter = Chapter.query().findById(chapterId)
      .withGraphJoined('chapter_version', {maxBatchSize: 1})
      .orderBy('chapter_version.id')

    return chapter
  }

  static getChapterByIdWithBook (chapterId) {
    const chapter = Chapter.query().findById(chapterId)
      .withGraphJoined('book', {maxBatchSize: 1})
      .first()

    return chapter
  }

  static async getAll () {
    return Chapter.query()
      .whereNull('deleted_at')
  }

  static async sort (data) {
    var count = 0
    for (let i = 0; i < data.length; i++) {
      var row = data[i]
      // eslint-disable-next-line no-unused-vars
      var item = await Chapter.query()
        .patch({ order: count })
        .where('uuid', '=', row.uuid)

      count++
    }

    return count
  }

  static async save (data) {
    // Get the max order first before saving to fix scene order error
    if (!data.id) {
      const query = Chapter.query()
        .select('order')
        .max('order')
        .where('book_id', data.book_id)
        .whereNull('deleted_at')

      let chapterMaxOrder = await query

      if (chapterMaxOrder) {
        data.order = chapterMaxOrder[0].order + 1
      }
    }

    const upsertGraphOptions = {
      relate: ['chapter_version'],
      noDelete: ['chapter_version'],
      update: ['chapter_version']
    }

    if (data.updated_at) delete data.updated_at
    if (data.chapter_version.updated_at) delete data.chapter_version.updated_at

    const saveChapter = await Chapter.query().upsertGraphAndFetch([data], upsertGraphOptions).first()

    const chapter = Chapter.query()
      .findById(saveChapter.uuid)
      .withGraphJoined('chapter_version', {maxBatchSize: 1})
      .orderBy('chapter_version.created_at', 'DESC')

    return chapter
  }

  static async delete (chapterId) {
    const chapter = await Chapter.query().softDeleteById(chapterId)

    await Scene.query()
      .where('chapter_id', chapterId)
      .patch({
        chapter_id: null
      })

    return chapter
  }

  static async getSyncable (params) {
    var userId = params.query.userID
    var bookUUID = params.query.parent_uuid
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    /*
    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)
      .whereNull('books.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }
    */

    const rows = await Chapter.query()
      .where('book_id', '=', bookUUID)
      .where('updated_at', '>', user.synced_at)

    console.log('BOOK UO ==> ', bookUUID)
    console.log('chapters ==> ', rows.length)

    return rows
  }

  static async sync (datas) {
    var rows = []
    if (!Array.isArray(datas)) rows.push(datas)
    else rows = datas

    for (let i = 0; i < rows.length; i++) {
      var row = rows[i]
      var columns = {
        uuid: row.uuid,
        book_id: row.book_id,
        title: row.title,
        chapter_guidance: row.chapter_guidance,
        hidden: row.hidden,
        order: row.order,
        type: row.type,
        short_description: row.short_description,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
        from_local: row.from_local
      }

      var data = await Chapter.query()
        .patch(columns)
        .where('uuid', '=', row.uuid)

      if (!data || data === 0) {
        data = await Chapter.query().insert(columns)
        // update uuid to match web
        data = await Chapter.query()
          .patch({'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at})
          .where('uuid', '=', data.uuid)
      }
    }

    return true
  }
}

module.exports = {
  ChapterController
}
