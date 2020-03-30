'use strict'
const path = require('path')

const { RelationDetail } = require(path.join(__dirname, '..', 'models'))

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
    const relationDetail = await RelationDetail.query().softDeleteById(relationDetailId)

    return relationDetail
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
