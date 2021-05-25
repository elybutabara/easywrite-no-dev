'use strict'
const path = require('path')

const { AdminTreadline, UserTreadline, User } = require(path.join(__dirname, '..', 'models'))

class TreadlineController {

    static getAdminTreadline () {
        var treadline = AdminTreadline.query()
            .whereNull('deleted_at')
            .first()
        return treadline
    }

    static getAnswersByBook(bookID) {
        var answer = UserTreadline.query()
            .where('book_id', bookID)
            .whereNull('deleted_at')
        
        return answer
    }

    static async save(data) {
        var saved = await UserTreadline.query()
        .patch(data)
        .where('user_id', data.user_id)
        .andWhere('book_id', data.book_id)

        if (!saved || saved === 0) {
            saved = await UserTreadline.query().insert(data)
        }

        return saved
    }

    static async getSyncable (params) {
        var userId = params.query.userID
        var bookUUID = params.query.parent_uuid

       
        const user = await User.query()
        .findById(userId)
        .withGraphJoined('author', { maxBatchSize: 1 })
        
        var synced_at = (!user.synced_at) ? '1970-01-01 00:00:00' : user.synced_at

        const rows = await UserTreadline.query()
          .where('book_id', '=', bookUUID)
          .where('updated_at', '>', synced_at)


        return rows
    }

    static async sync (rows) {
        for (let i = 0; i < rows.length; i++) {
          var row = rows[i]
          var columns = {
            uuid: row.uuid,
            user_id: row.user_id,
            book_id: row.book_id,
            answer_1: row.answer_1,
            answer_2: row.answer_2,
            answer_3: row.answer_3,
            answer_4: row.answer_4,
            answer_5: row.answer_5,
            answer_6: row.answer_6,
            answer_7: row.answer_7,
            answer_8: row.answer_8,
            answer_9: row.answer_9,
            answer_10: row.answer_10,
            answer_11: row.answer_11,
            ending: row.ending,
            created_at: row.created_at,
            updated_at: row.updated_at,
            deleted_at: row.deleted_at,
          }

          var data = await UserTreadline.query()
            .patch(columns)
            .where('uuid', '=', row.uuid)
    
          if (!data || data === 0) {
            data = await UserTreadline.query().insert(columns)

            // update uuid to match web
            data = await UserTreadline.query()
              .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
              .where('uuid', '=', data.uuid)
          }
        }
    
        return 1
    }

}

module.exports = {
    TreadlineController
}
  