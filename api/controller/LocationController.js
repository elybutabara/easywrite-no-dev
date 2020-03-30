'use strict'
const path = require('path')

const { Location } = require(path.join(__dirname, '..', 'models'))

class LocationController {
  static getAllByBookId (param) {
    var locations = Location.query()
      .where('book_id', param.bookId)
      .where('location', 'like', '%' + param.search + '%')
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
    const location = await Location.query().softDeleteById(locationId)

    return location
  }

  static async sync (row) {
    var data = await Location.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Location.query().insert(row)

      // update uuid to match web
      data = await Location.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  LocationController
}
