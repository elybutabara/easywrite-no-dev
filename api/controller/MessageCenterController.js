'use strict'
const path = require('path')
const { Notification, Book } = require(path.join(__dirname, '..', 'models'))

class MessageCenterController {
  static async getAll (authorUuid) {
    const notification = await this.notifications(authorUuid)
    const invitations = await this.invitations(authorUuid)

    return {
      'notifications': notification,
      'invitations': invitations
    }
  }

  static async notifications (authorUuid) {
    const notificationType = ['feedback', 'personalize-notification', 'reader-directory', 'book', 'book-directory', 'book_invite_decision', 'notif', 'chapter_comment', 'scene_comment']
    var notification = await Notification.query()
      .where('to', authorUuid)
      .withGraphJoined('fromAuthor', { maxBatchSize: 1 })
      .withGraphJoined('toAuthor', { maxBatchSize: 1 })
      .whereIn('type', notificationType)
      .whereNotIn('action', ['invite'])
      .orderBy('created_at', 'desc')

    let notifications = []
    notification.forEach(function (data, index) {
      data.alias = (data.fromAuthor && data.fromAuthor.alias) ? data.fromAuthor.alias : null
      if (data.type == 'book' && ['query', 'invitation'].indexOf(data.action) > -1) {
        // $book = Book::with('author').find(data.book_id);
        if (data.parent_name === 'book') {
          data.book = Book.query().findById(data.parent_id).withGraphJoined('author', { maxBatchSize: 1 })
          notifications.push(data)
        } else if (data.parent_name === 'book_reader_invitations') {
          // $book_reader_inv = BookReaderInvitation::with('book').find(data.parent_id);
          // data.book = $book_reader_inv.book;
          //
          // if(data.from === data.to) {
          //   data.alias = $book_reader_inv.email;
          // }
        } else {
          data.book = Book.query().findById(data.parent_id).withGraphJoined('author', { maxBatchSize: 1 })
          // $book = Book::with('author').find(data.book_id);
          // data.book = $book;
        }

        data.author = data.fromAuthor
        return data
      }
      return data
    })

    return notifications
  }

  static async invitations (authorUuid) {
    var notification = Notification.query()
      .where('to', authorUuid)
      .where('status', 0)
      .whereIn('type', ['book', 'book_re_read', 'book_invite_decision', 'book_reader'])
      .where('action', 'invite')
      .orderBy('created_at', 'desc')

    notification = []
    return notification
  }
}
module.exports = {
  MessageCenterController
}
