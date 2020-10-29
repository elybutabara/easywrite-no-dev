'use strict'
const path = require('path')

const { User, Notification } = require(path.join(__dirname, '..', 'models'))

class NotificationController {
  static async getAll (authorUuid) {
    // console.log(authorUuid)
    // var notification = Notification.query()
    //   .where('to', authorUuid)
    //   .whereNull('deleted_at').orderBy('created_at', 'desc')
    //
    // for (var i = 0; i < notification.length; i++) {
    //   try {
    //     notification[i]['data'] = JSON.parse(notification[i]['data'])
    //   } catch (e) {
    //     notification[i]['data'] = {}
    //   }
    // }
    //
    // return notification
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      from: row.from,
      to: row.to,
      parent_id: row.parent_id,
      parent_name: row.parent_name,
      status: row.status,
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
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }
    return data
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const rows = await Notification.query()
      .where('to', user.author.uuid)
      .where('updated_at', '>', user.synced_at)
    return rows
  }

  static async save (data) {
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
