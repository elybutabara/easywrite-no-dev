'use strict'
const path = require('path')

const { Relation, User } = require(path.join(__dirname, '..', 'models'))

class RelationController {
  static async getAll () {
    const relations = await Relation.query()
      .orderBy('created_at')
      .whereNull('deleted_at')

    return relations
  }

  static async save (data) {
    const save = await Relation.query().upsertGraph([data]).first()
    return save
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const rows = Relation.query()
      .where('author_id', user.author.uuid)
      .where('updated_at', '>', user.synced_at)
      // .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await Relation.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Relation.query().insert(row)

      // update uuid to match web
      data = await Relation.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  RelationController
}
