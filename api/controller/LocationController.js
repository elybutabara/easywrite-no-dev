'use strict'
const path = require('path')
const moment = require('moment')

const { Book, Location, User } = require(path.join(__dirname, '..', 'models'))

class LocationController {
  static getAllByBookId (param) {
    var locations = Location.query()
      // .where('book_id', param.bookId)
      .whereRaw("book_id = '" + param.bookId + "' AND (location LIKE '%" + param.search + "%' OR location IS NULL)")

      //   .where('location', 'like', '%' + param.search + '%')
      // .orWhere('location', null)
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

    if (data.updated_at) delete data.updated_at

    if (data.file_changed) {
      let picture_updated_at = moment().format('YYYY-MM-DD HH:mm:ss').toString()
      data.picture_updated_at = picture_updated_at
    }

    delete data.file_changed

    const saveLocation = await Location.query().upsertGraph([data]).first()

    const location = Location.query()
      .withGraphJoined('book')
      .findById(saveLocation.uuid)

    return location
  }

  static async updateLineColor (locationID, data) {
    var location = await Location.query()
      .patch({ line_color: data.color })
      .where('id', '=', locationID)

    location = Location.query()
      .where('id', '=', locationID).first()

    return location
  }

  static async hideStoryline (locationID, data) {
    var row = await Location.query()
      .where('id', '=', locationID).first()

    var location = await Location.query()
      .patch({ storyline_hidden: !row.storyline_hidden })
      .where('id', '=', locationID)

    row.storyline_hidden = !row.storyline_hidden
    return row
  }

  static async delete (locationId) {
    const location = await Location.query().softDeleteById(locationId)

    return location
  }

  static async getSyncable (params) {
    var userId = params.query.userID
    var bookUUID = params.query.parent_uuid

    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

      /*
    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)
      .whereNull('books.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }
    */

    const rows = await Location.query()
      .where('book_id', '=', bookUUID)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (datas) {
    var rows = []
    if (!Array.isArray(datas)) rows.push(datas)
    else rows = datas

    for (let i = 0; i < rows.length; i++) {
      var row = rows[i]
      var columns = {
        uuid: row.uuid,
        book_id: row.book_id,
        location: row.location,
        description: row.description,
        AKA: row.AKA,
        tags: row.tags,
        pictures: row.pictures,
        line_color: row.line_color,
        storyline_hidden: row.storyline_hidden,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
        from_local: row.from_local
      }

      var data = await Location.query()
        .patch(columns)
        .where('uuid', '=', row.uuid)

      if (!data || data === 0) {
        data = await Location.query().insert(columns)

        // update uuid to match web
        data = await Location.query()
          .patch({'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at})
          .where('uuid', '=', data.uuid)
      }
    }

    return true
  }
}

module.exports = {
  LocationController
}
