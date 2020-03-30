'use strict'
const path = require('path')
const moment = require('moment')

const { Character, RelationDetail } = require(path.join(__dirname, '..', 'models'))

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
    const character = await Character.query().softDeleteById(characterId)

    await RelationDetail.query()
      .where('character_id', characterId)
      .orWhere('character_relation_id', characterId)
      .patch({
        deleted_at: moment().format('YYYY-MM-DD hh:mm:ss').toString()
      })

    return character
  }

  static async sync (row) {
    var data = await Character.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Character.query().insert(row)

      // update uuid to match web
      data = await Character.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  CharacterController
}
