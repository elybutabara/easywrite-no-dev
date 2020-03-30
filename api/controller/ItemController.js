'use strict'
const path = require('path')

const { Item } = require(path.join(__dirname, '..', 'models'))

class ItemController {
  static getAllByBookId (param) {
    var items = Item.query()
      .where('book_id', param.bookId)
      .where('itemname', 'like', '%' + param.search + '%')
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

  static async sync (row) {
    var data = await Item.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Item.query().insert(row)

      // update uuid to match web
      data = await Item.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  ItemController
}
