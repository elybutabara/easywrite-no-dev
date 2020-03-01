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
}

module.exports = {
  LocationController
}
