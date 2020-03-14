'use strict'
const path = require('path')

const { RelationDetail } = require(path.join(__dirname, '..', 'models'))

class RelationDetailController {
  static async save (data) {
    const save = await RelationDetail.query().upsertGraph([data]).first()
    return save
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await RelationDetail.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await RelationDetail.query().insert(rows[i])

        // update uuid to match web
        data = await RelationDetail.query()
          .patch({ 'uuid': rows[i].uuid })
          .where('uuid', '=', data.uuid)

        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  RelationDetailController
}
