'use strict'
const path = require('path')

const { ChapterVersion } = require(path.join(__dirname, '..', 'models'))

class ChapterVersionController {
  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await ChapterVersion.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await ChapterVersion.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  ChapterVersionController
}
