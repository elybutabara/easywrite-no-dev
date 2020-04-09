'use strict'
const path = require('path')
const moment = require('moment')

const { Book, Character, RelationDetail, User } = require(path.join(__dirname, '..', 'models'))

class RelationDetailController {
  static getRelationDetailByCharacterId (characterId) {
    var relationDetail = RelationDetail.query()
      .withGraphFetched('character_relation')
      .withGraphFetched('relation')
      .where('book_relation_details.character_id', characterId)
      .whereNull('book_relation_details.deleted_at')
      .orderBy('created_at')

    return relationDetail
  }

  static async save (data) {
    const save = await RelationDetail.query().upsertGraph([data])
      .withGraphFetched('character_relation')
      .withGraphFetched('relation')
      .first()

    return save
  }

  static async delete (relationDetailId) {
    // const relationDetail = await RelationDetail.query().softDeleteById(relationDetailId)
    var data = await RelationDetail.query()
      .patch({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString() })
      .where('uuid', '=', relationDetailId)

    return data
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)
      .whereNull('books.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }

    const characters = await Character.query()
      .whereIn('book_id', bookUUIDs)
      .whereNull('deleted_at')

    var characterUUIDs = []

    for (let i = 0; i < characters.length; i++) {
      characterUUIDs.push(characters[i].uuid)
    }

    const rows = await RelationDetail.query()
      .where(builder => {
        builder
          .whereIn('character_id', characterUUIDs)
          .orWhereIn('character_relation_id', characterUUIDs)
      })
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var data = await RelationDetail.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await RelationDetail.query().insert(row)

      // update uuid to match web
      data = await RelationDetail.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }
    return data
  }
}

module.exports = {
  RelationDetailController
}
