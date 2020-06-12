'use strict'
const path = require('path')

const { Book, Feedback, Chapter, Scene, Reader, User } = require(path.join(__dirname, '..', 'models'))

class FeedbackController {
  static getAllFeedbacksByBookId (bookId) {
    var feedbacks = Feedback.query()
      .where('parent', 'book')
      .where('parent_id', bookId)
      .withGraphJoined('[feedback_responses.author]', {maxBatchSize: 1})
      .withGraphJoined('author', {maxBatchSize: 1})
      .orderBy('id', 'asc')

    return feedbacks
  }

  static getAllFeedbacksByChapterId (chapterId) {
    var feedbacks = Feedback.query()
      .where('parent', 'chapter')
      .where('parent_id', chapterId)
      .withGraphJoined('[feedback_responses.author]', {maxBatchSize: 1})
      .modifyGraph('[feedback_responses]', builder => {
        builder.orderBy('feedback_responses.id', 'asc')
      })
      .withGraphJoined('author', {maxBatchSize: 1})
      .orderBy('id', 'asc')

    return feedbacks
  }

  static getAllFeedbacksBySceneId (sceneId) {
    var feedbacks = Feedback.query()
      .where('parent', 'scene')
      .where('parent_id', sceneId)
      .withGraphJoined('[feedback_responses.author]', {maxBatchSize: 1})
      .withGraphJoined('author', {maxBatchSize: 1})
      .orderBy('id', 'asc')

    return feedbacks
  }

  static async save (data) {
    const feedback = await Feedback.query().upsertGraphAndFetch([data]).first()

    var row = Feedback.query()
      .where('feedbacks.uuid', feedback.uuid)
      .withGraphJoined('feedback_responses', {maxBatchSize: 1})
      .withGraphJoined('author', {maxBatchSize: 1})
      .first()

    return row
  }

  static async updateStatus (row) {
    var data = await Feedback.query()
      .patch({ is_done: !row.is_done })
      .where('uuid', '=', row.uuid)

    return data
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    var parentIDs = []
    var bookUUIDs = []

    // get all "my books" IDs
    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }

    // get all "books i read" IDs
    const booksIRead = await Reader.query()
      .where('author_id', user.author.uuid)

    for (let i = 0; i < booksIRead.length; i++) {
      bookUUIDs.push(booksIRead[i].book_id)
      parentIDs.push(booksIRead[i].book_id)
    }

    // get all "chapters" IDs
    const chapters = await Chapter.query()
      .whereIn('book_id', bookUUIDs)

    var chapterUUIDs = []

    for (let i = 0; i < chapters.length; i++) {
      chapterUUIDs.push(chapters[i].uuid)
      parentIDs.push(chapters[i].uuid)
    }

    // get all "scenes" IDs
    const scenes = await Scene.query()
      .whereIn('book_id', bookUUIDs)

    var sceneUUIDs = []

    for (let i = 0; i < scenes.length; i++) {
      sceneUUIDs.push(scenes[i].uuid)
      parentIDs.push(scenes[i].uuid)
    }

    const rows = await Feedback.query()
      .whereIn('parent_id', parentIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await Feedback.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Feedback.query().insert({
        uuid: row.uuid,
        chapter_id: row.chapter_id,
        from: row.from,
        to: row.to,
        chapter_version_id: row.chapter_version_id,
        mark: row.mark,
        published: row.published,
        type: row.type,
        mark_as_finished: row.mark_as_finished,
        general_comment: row.general_comment,
        book_chapter_comment: row.book_chapter_comment,
        message: row.message,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at
      })

      // update uuid to match web
      data = await Feedback.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  FeedbackController
}
