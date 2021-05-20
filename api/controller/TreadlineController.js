'use strict'
const path = require('path')

const { AdminTreadline, UserTreadline } = require(path.join(__dirname, '..', 'models'))

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
        console.log('ddddd', data)
        var saved = await UserTreadline.query()
        .patch(data)
        .where('user_id', data.user_id)
        .andWhere('book_id', data.book_id)

        if (!saved || saved === 0) {
            saved = await UserTreadline.query().insert(data)
        }

        return saved
    }

}

module.exports = {
    TreadlineController
}
  