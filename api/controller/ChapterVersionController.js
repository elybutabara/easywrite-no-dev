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

  static async setAsCurrentVersion (versionUuid) {
    const version = await ChapterVersion.query()
      .findById(versionUuid)

    await ChapterVersion.query()
      .update({ is_current_version: 0 })
      .where('chapter_id', version.chapter_id)

    const currentVersion = await version.$query()
      .patchAndFetch({ is_current_version: 1 })
      .first()

    return currentVersion
  }

  static async save (data) {
    if (data.updated_at) delete data.updated_at
    var version = await ChapterVersion.query()
      .patch({ 'is_current_version': 0 })
      .where('is_current_version', '=', true)
      .where('chapter_id', '=', data.chapter_id)

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
    // console.log('chapterVersion...............................', chapterVersion)

    const row = await ChapterVersion.query().where('book_chapter_versions.uuid', chapterVersion.uuid).withGraphJoined('chapter', {maxBatchSize: 1}).first()
    // console.log('chapterVersion.chapter..............', row.chapter)

    let book = await Book.query().where('uuid', row.chapter.book_id).first()
    // console.log('book.author_id................................', book.author_id)

    //
    var notifyUsers = {}

    // notify the author
    notifyUsers[book.author_id] = 1

    var comments = null
    try {
      comments = JSON.parse(data.comments)
    } catch (e) {
      comments = null
    }

    if (comments) {
      for (var k in comments) {
        var commentsGroups = comments[k]

        for (var k2 in commentsGroups) {
          var comment = commentsGroups[k2]

          // console.log('comment................................................................', comment)

          if (notifyUsers[comment.user_id]) {
            continue
          }
          notifyUsers[comment.user_id] = 1
        }
      }

      for (var x in notifyUsers) {
        if (x === newComment.user_id) {
          continue
        }

        const notification = await Notification.query().upsertGraphAndFetch([{
          type: 'ChapterComment',
          name: 'chapter-' + data.chapter_id,
          data: JSON.stringify(newComment),
          user_id: x
        }]).first()

        if (notification) {
          //
        }
        // console.log(notification)
      }
    }
    return chapterVersion
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

    const chapters = await Chapter.query()
      .where('book_id', '=', bookUUID)
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

  static async sync (datas) {
    var rows = []
    if (!Array.isArray(datas)) rows.push(datas)
    else rows = datas

    for (let i = 0; i < rows.length; i++) {
      var row = rows[i]
      var columns = {
        uuid: row.uuid,
        chapter_id: row.chapter_id,
        content: row.content,
        change_description: row.change_description,
        comments: row.comments,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
        from_local: row.from_local,
        is_current_version: row.is_current_version
      }

      var data = await ChapterVersion.query()
        .patch(columns)
        .where('uuid', '=', row.uuid)

      if (!data || data === 0) {
        data = await ChapterVersion.query().insert(columns)

        // update uuid to match web
        data = await ChapterVersion.query()
          .patch({'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at})
          .where('uuid', '=', data.uuid)
      }
    }

    return true
  }
}

module.exports = {
  ChapterVersionController
}
