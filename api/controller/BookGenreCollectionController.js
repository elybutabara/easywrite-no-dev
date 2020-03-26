'use strict'
const path = require('path')

const { BookGenreCollection } = require(path.join(__dirname, '..', 'models'))

class BookGenreCollectionController {
  static async save (data) {
    const save = await BookGenreCollection.query().upsertGraph([data]).first()
    return save
  }

  static async sync (row) {
    var data = await BookGenreCollection.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await BookGenreCollection.query().insert(row)

      // update uuid to match web
      data = await BookGenreCollection.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  BookGenreCollectionController
}
