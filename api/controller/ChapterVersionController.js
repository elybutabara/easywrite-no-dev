'use strict'
const path = require('path')

const { Book, Chapter, ChapterVersion, Notification, User } = require(path.join(__dirname, '..', 'models'))

class ChapterVersionController {
  static getAllChapterVersionsByChapterId (chapterId) {
    var version = ChapterVersion.query()
      .where('chapter_id', chapterId)
      .whereNull('deleted_at')
      .orderBy('id', 'asc')

    return version
  }

  static async save (data) {
    const chapterVersion = await ChapterVersion.query().upsertGraphAndFetch([data]).first()

    return chapterVersion
  }

  static async comment (data) {
    var newComment = data['new_comment_json']

    try {
      newComment = JSON.parse(newComment)
    } catch (e) {
      newComment = '{}'
    }

    delete data['new_comment_json']
    const chapterVersion = await ChapterVersion.query().upsertGraphAndFetch([data]).first()
    console.log(chapterVersion)

    const notification = await Notification.query().upsertGraphAndFetch([{
      type: 'ChapterComment',
      name: 'chapter-' + data.chapter_id,
      data: JSON.stringify(newComment),
      user_id: newComment.user_id
    }]).first()

    if (notification) {
      //
    }
    console.log(notification)

    return chapterVersion
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)
      .whereNull('books.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }

    const chapters = await Chapter.query()
      .whereIn('book_id', bookUUIDs)
      .whereNull('deleted_at')

    var chapterUUIDs = []

    for (let i = 0; i < chapters.length; i++) {
      chapterUUIDs.push(chapters[i].uuid)
    }

    const rows = await ChapterVersion.query()
      .whereIn('chapter_id', chapterUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      chapter_id: row.chapter_id,
      content: row.content,
      change_description: row.change_description,
      comments: row.comments,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
      from_local: row.from_local
    }

    var data = await ChapterVersion.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await ChapterVersion.query().insert(columns)

      // update uuid to match web
      data = await ChapterVersion.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  ChapterVersionController
}
