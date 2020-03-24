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

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await RelationDetail.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await RelationDetail.query().insert(rows[i])

        // update uuid to match web
        data = await RelationDetail.query()
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
  RelationDetailController
}
