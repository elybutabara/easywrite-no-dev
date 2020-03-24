'use strict'
const path = require('path')

const { Item } = require(path.join(__dirname, '..', 'models'))

class ItemController {
  static getAllByBookId (bookId) {
    var items = Item.query()
      .where('book_id', bookId)
      .withGraphJoined('book')
      .whereNull('book_items.deleted_at')

    return items
  }

  static getByItemId (itemId) {
    var item = Item.query()
      .withGraphJoined('book')
      .findById(itemId)

    return item
  }

  static async save (data) {
    const saveItem = await Item.query().upsertGraph([data]).first()

    const item = Item.query()
      .withGraphJoined('book')
      .findById(saveItem.uuid)

    return item
  }

  static async delete (itemId) {
    const item = await Item.query().softDeleteById(itemId)

    return item
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
