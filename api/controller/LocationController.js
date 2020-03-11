'use strict'
const path = require('path')

const { Location } = require(path.join(__dirname, '..', 'models'))

class LocationController {
  static getAllByBookId (bookId) {
    var locations = Location.query()
      .where('book_id', bookId)
      .withGraphJoined('book')
      .whereNull('book_locations.deleted_at')

    return locations
  }

  static getByLocationId (locationId) {
    var location = Location.query()
      .withGraphJoined('book')
      .findById(locationId)

    return location
  }

  static async save (data) {
    const saveLocation = await Location.query().upsertGraph([data]).first()

    const location = Location.query()
      .withGraphJoined('book')
      .findById(saveLocation.uuid)

    return location
  }

  static async delete (locationId) {
    const location = await Location.query().findById(locationId).softDelete()

    return location
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
