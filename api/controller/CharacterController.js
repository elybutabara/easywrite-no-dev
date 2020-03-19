'use strict'
const path = require('path')

const { Character } = require(path.join(__dirname, '..', 'models'))

class CharacterController {
  static getAllByBookId (bookId) {
    var characters = Character.query()
      .where('book_id', bookId)
      .withGraphJoined('book')
      .whereNull('book_characters.deleted_at')

    return characters
  }

  static getByCharacterId (characterId) {
    var character = Character.query()
      .withGraphJoined('book')
      .findById(characterId)

    return character
  }

  static async save (data) {
    const saveCharacters = await Character.query().upsertGraph([data]).first()

    const character = Character.query()
      .withGraphJoined('book')
      .findById(saveCharacters.uuid)

    return character
  }

  static async delete (characterId) {
    const character = await Character.query().findById(characterId).softDelete()

    return character
  }

  static async sync (rows) {
    var updated = 0
    var inserted = 0

    for (var i = 0; i < rows.length; i++) {
      var data = await Character.query()
        .patch(rows[i])
        .where('uuid', '=', rows[i].uuid)

      if (!data || data === 0) {
        data = await Character.query().insert(rows[i])

        // update uuid to match web
        data = await Character.query()
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
  CharacterController
}
