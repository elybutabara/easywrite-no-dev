'use strict'
// const { query } = require('express')
const path = require('path')
const moment = require('moment')
const { User, Notification, Book, Author, Chapter, Scene } = require(path.join(__dirname, '..', 'models'))
const { CommentController } = require(path.join(__dirname, 'CommentController'));

class NotificationController {
  static async getAll (authorUuid) {
    var notification = await this.notifications(authorUuid)
    var invitations = await this.invitations(authorUuid)

    if (invitations != undefined) {
      invitations = invitations.filter(model => {
        return (model.book != null)
      })
    }

    return {
      'notifications': notification || [],
      'invitations': invitations || []
    }
  }

  static async notifications (authorUuid) {
    /**
     * QUERY HERE | Get notifications | feedback and comments only
     */

    const notificationType = ['feedback', 'chapter_comment', 'scene_comment', 'chapter_inline_comment',
        'scene_inline_comment']
    var notification = await Notification.query()
      .where(`to`, authorUuid)
      .whereIn('type', notificationType)
      .orderBy(`created_at`, 'desc')
      .whereNull('deleted_at')

    for (let i = 0; i < notification.length; i++) {
      // get sender
      const from = await Author.query()
        .findById(notification[i].from)
      const alias = from && from.alias ? from.alias : 'Anonymous'

      notification[i].alias = alias

      const book = await Book.query()
        .withGraphJoined('author')
        .where('books.uuid', notification[i].book_id)
        .whereNull('books.deleted_at')

      notification[i].book = book ? book[0] : null

      if (notification[i].type === 'feedback' && (notification[i].action == 'post' || notification[i].action === 'response')) {
        if (notification[i].parent_name == 'chapter') {
          const chapter = await Chapter.query()
            .withGraphJoined('chapter_version')
            .modifyGraph('chapter_version', builder => {
              builder.whereNull('deleted_at')
              builder.orderBy('created_at')
            })
            .where('book_chapters.uuid', notification[i].parent_id)

          notification[i].chapter = chapter ? chapter[0] : null
        } else if (notification[i].parent_name == 'scene') {
          const scene = await Scene.query()
            .withGraphJoined('book')
            .withGraphJoined('chapter')
            .whereNull('book.deleted_at')
            .whereNull('book_scenes.deleted_at')
            .where('book_scenes.uuid', notification[i].parent_id)
            .whereNull('chapter.deleted_at')
          notification[i].scene = scene ? scene[0] : null
          notification[i].chapter = scene[0] ? scene[0].chapter : null
        }
      } else if (notification[i].type === 'notif' && notification[i].action === 'response') {
        notification[i].message = from[0].alias + 'Sent you a message'
        return notification
      } else if (notification[i].type === 'chapter_comment' && notification[i].action == 'post') {
        const chapter = await Chapter.query()
          .withGraphJoined('chapter_version')
          .modifyGraph('chapter_version', builder => {
            builder.whereNull('deleted_at')
            builder.orderBy('created_at')
          })
          .where('book_chapters.uuid', notification[i].parent_id)

        notification[i].chapter = chapter ? chapter[0] : null
        notification[i].author = from ? from[0] : null

        if (!chapter) return null
      } else if (notification[i].type === 'chapter_inline_comment'
          && (notification[i].action === 'post' || notification[i].action === 'reply')) {

          const comment = await CommentController.getByCommentUUID(notification[i].parent_id);
          const chapter = await Chapter.query()
              .withGraphJoined('chapter_version')
              .modifyGraph('chapter_version', builder => {
                  builder.whereNull('deleted_at')
                  builder.orderBy('created_at')
              })
              .where('book_chapters.uuid', comment.parent_id)

          notification[i].chapter = chapter ? chapter[0] : null;
          notification[i].author = from ? from[0] : null;
          notification[i].comment = !comment.comment_id ? comment
              : await CommentController.getByCommentUUID(comment.comment_id);

      }  else if (notification[i].type === 'scene_comment' && notification[i].action == 'post') {
        const scene = await Scene.query()
          .withGraphJoined('chapter')
          .modifyGraph('chapter', builder => {
            builder.whereNull('deleted_at')
          })
          .whereNull('book_scenes.deleted_at')
          .where('book_scenes.uuid', notification[i].parent_id)

        notification[i].scene = scene ? scene[0] : null
        notification[i].chapter = scene[0] ? scene[0].chapter : null
        notification[i].author = from ? from[0] : null

        if (!scene) return null
      } else if (notification[i].type === 'scene_inline_comment'
          && (notification[i].action === 'post' || notification[i].action === 'reply')) {

          const comment = await CommentController.getByCommentUUID(notification[i].parent_id);
          const scene = await Scene.query()
              .withGraphJoined('chapter')
              .modifyGraph('chapter', builder => {
                  builder.whereNull('deleted_at')
              })
              .whereNull('book_scenes.deleted_at')
              .where('book_scenes.uuid', comment.parent_id)

          notification[i].scene = scene ? scene[0] : null;
          notification[i].chapter = scene[0] ? scene[0].chapter : null;
          notification[i].author = from ? from[0] : null;
          notification[i].comment = !comment.comment_id ? comment
              : await CommentController.getByCommentUUID(comment.comment_id);

      } else {
        notification[i].author = from ? from[0] : null
      }
    }

    /** map remove notification if parent deleted.
     *  book => if book is null
     *  chapter => if chapter and book is null
     *  scene => if scene and chapter and book is null
     */

    if (notification != undefined) {
      notification = notification.filter(model => {
        return (
          ((model.parent_name == null || model.parent_name == 'book' || model.parent_name == 'book_reader_invitations') && model.book != null) ||
          (model.parent_name == 'chapter' && model.chapter != null && model.chapter != undefined && model.book != null) ||
          (model.parent_name == 'scene' && model.scene != null && model.scene != undefined && model.chapter != null && model.chapter != undefined && model.book != null) ||
            (model.parent_name == 'comment')
        )
      })
    }

    return notification
  }

  static async updateNotificationStatus (row) {
    await Notification.query().patch({status: 1}).where('uuid', row.model.uuid)
    return this.notifications(row.authorUUID)
  }

  static async invitations (authorUuid) {
    var notification = []
    notification = Notification.query()
      .withGraphJoined('book')
      .modifyGraph('book', builder => {
        builder.whereNull('deleted_at')
      })
      .where('to', authorUuid)
      .where('status', 0)
      .whereIn('type', ['book', 'book_re_read', 'book_invite_decision', 'book_reader'])
      .where('action', 'invite')
      .orderBy('created_at', 'desc')

    return notification
  }

  static async sync (datas) {
    var rows = []
    if (!Array.isArray(datas)) rows.push(datas)
    else rows = datas

    for (let i = 0; i < rows.length; i++) {
      var row = rows[i]
      var columns = {
        uuid: row.uuid,
        from: row.from,
        to: row.to,
        parent_id: row.parent_id,
        book_id: row.book_id,
        parent_name: row.parent_name,
        status: row.status,
        data: row.data,
        type: row.type,
        action: row.action,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at
      }
      var data = await Notification.query().patch(columns).where('uuid', '=', row.uuid)

      if (!data || data === 0) {
        data = await Notification.query().insert(columns)

        // update uuid to match web
        data = await Notification.query()
          .patch({'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at})
          .where('uuid', '=', data.uuid)
      }
    }

    return true
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

      /*
      * Update update_at so it will push to api , api will handle parent_id
      * so after upload it will download latest notif that will convert parent_id that is id to uuid
      * */
    await Notification.query()
      .where(`to`, user.author.uuid)
      .where('parent_id', 'not like', '%-%')
      .patch({updated_at: moment().format('YYYY-MM-DD HH:mm:ss').toString()})

    const rows = await Notification.query()
      .where('to', user.author.uuid)
      .where('updated_at', '>', user.synced_at)
    return rows
  }

  static async save (data) {
    if (data.updated_at) delete data.updated_at
    const notification = await Notification.query().upsertGraphAndFetch([data]).first()

    return notification
  }

  static async read (notificationId) {
    const notification = await Notification.query().upsertGraphAndFetch([{uuid: notificationId, is_seen: true}]).first()

    return notification
  }
}
module.exports = {
  NotificationController
}
