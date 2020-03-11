'use strict'
const path = require('path')

const { Location } = require(path.join(__dirname, '..', 'models'))

class LocationController {
  static getAllByBookId (bookId) {
    var locations = Location.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')

    return locations
  }

  static async save (data) {
    const save = await Location.query().upsertGraph([data]).first()
    return save
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await Location.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await Location.query().insert(rows[i])
        inserted++
      } else {
        updated++
      }
    }

    return { updated: updated, inserted: inserted }
  }
}

module.exports = {
  LocationController
}
