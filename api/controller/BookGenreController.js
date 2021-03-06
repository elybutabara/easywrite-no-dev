'use strict'
const path = require('path')

const { BookGenre, User } = require(path.join(__dirname, '..', 'models'))

class BookGenreController {
  static async save (data) {
    if (data.updated_at) delete data.updated_at
    const saveGenre = await BookGenre.query().upsertGraph([data]).first()

    return saveGenre
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const rows = BookGenre.query()
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (datas) {
    var rows = []
    if (!Array.isArray(datas)) rows.push(datas)
    else rows = datas

    for (let i = 0; i < rows.length; i++) {
      var row = rows[i]
      var data = await BookGenre.query()
        .patch(row)
        .where('uuid', '=', row.uuid)

      if (!data || data === 0) {
        data = await BookGenre.query().insert(row)

        // update uuid to match web
        data = await BookGenre.query()
          .patch({'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at})
          .where('uuid', '=', data.uuid)
      }
    }

    return true
  }
}

module.exports = {
  BookGenreController
}
