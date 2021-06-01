'use strict'
const path = require('path')

const { AdminTreadline } = require(path.join(__dirname, '..', 'models'))

class AdminTreadlineController {

    static getAdminTreadline () {
        var treadline = AdminTreadline.query()
            .whereNull('deleted_at')
            .first()
        return treadline
    }

    static async sync (rows) {
        for (let i = 0; i < rows.length; i++) {
          var row = rows[i]
          var columns = {
            uuid: row.uuid,
            title: row.title,
            core_of_story: row.core_of_story,

            question_1: row.question_1,
            comment_1: row.comment_1,

            question_2: row.question_2,
            comment_2: row.comment_2,

            question_3: row.question_3,
            comment_3: row.comment_3,

            question_4: row.question_4,
            comment_4: row.comment_4,

            question_5: row.question_5,
            comment_5: row.comment_5,

            question_6: row.question_6,
            comment_6: row.comment_6,

            question_7: row.question_7,
            comment_7: row.comment_7,

            question_8: row.question_8,
            comment_8: row.comment_8,
            
            question_9: row.question_9,
            comment_9: row.comment_9,

            question_10: row.question_10,
            comment_10: row.comment_10,

            question_11: row.question_11,
            comment_11: row.comment_11,

            ending: row.ending,

            created_at: row.created_at,
            updated_at: row.updated_at,
            deleted_at: row.deleted_at,
          }

          var data = await AdminTreadline.query()
            .patch(columns)
            .where('uuid', '=', row.uuid)
    
          if (!data || data === 0) {
            data = await AdminTreadline.query().insert(columns)

            // update uuid to match web
            data = await AdminTreadline.query()
              .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
              .where('uuid', '=', data.uuid)
          }
        }
    
        return 1
    }
}

module.exports = {
    AdminTreadlineController
}
  