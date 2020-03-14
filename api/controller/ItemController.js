'use strict'
const path = require('path')

const { Item } = require(path.join(__dirname, '..', 'models'))

class ItemController {
  static getAllByBookId (bookId) {
    var items = Item.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')

    return items
  }

  static async save (data) {
    const save = await Item.query().upsertGraph([data]).first()
    return save
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await Item.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await Item.query().insert(rows[i])

        // update uuid to match web
        data = await Item.query()
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
  ItemController
}
