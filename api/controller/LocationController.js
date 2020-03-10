'use strict'
const path = require('path')

const { Location } = require(path.join(__dirname, '..', 'models'))

class LocationController {
  static getAllByBookId (bookId) {
    var locations = Location.query()
      .where('book_id', bookId)
      .withGraphJoined('book')
      .whereNull('locations.deleted_at')

    return locations
  }
  static getByLocationId (locationId) {
    const location = Location.query()
      .withGraphJoined('book')
      .findById(locationId)

    return location
  }
  static async save (data) {
    const saveLocation = await Location.query().upsertGraph([data]).first()

    const location = Location.query()
      .withGraphJoined('book')
      .findById(saveLocation.id)

    return location
  }
  static delete (locationId) {
    const location = Location.query().findById(locationId).softDelete()

    return location
  }
}

module.exports = {
  LocationController
}
