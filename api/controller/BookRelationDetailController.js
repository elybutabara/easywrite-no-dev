'use strict'
const path = require('path')

const { BookRelationDetail } = require(path.join(__dirname, '..', 'models'))

class BookRelationDetailController {
  static async save (data) {
    const save = await BookRelationDetail.query().upsertGraph([data]).first()
    return save
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await BookRelationDetail.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await BookRelationDetail.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  BookRelationDetailController
}
