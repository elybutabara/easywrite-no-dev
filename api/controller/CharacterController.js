'use strict'
const path = require('path')
const moment = require('moment')

const { Book, Character, RelationDetail, User } = require(path.join(__dirname, '..', 'models'))

class CharacterController {
  static async getAllByBookId (param) {
    var characters = await Character.query()
      .where('book_id', param.bookId)
      .where('fullname', 'like', '%' + param.search + '%')
      .withGraphJoined('book')
      .whereNull('book_characters.deleted_at')
      .orderByRaw('lower(book_characters.fullname)')
    return characters
  }

  static getByCharacterId (characterId) {
    var character = Character.query()
      .withGraphJoined('book')
      .findById(characterId)

    return character
  }

  static async save (data) {
    if (data.updated_at) delete data.updated_at


    if (data.file_changed) {
      let picture_updated_at = moment().format('YYYY-MM-DD HH:mm:ss').toString()
      data.picture_updated_at = picture_updated_at
    }

    delete data.file_changed
    
    const saveCharacters = await Character.query().upsertGraph([data]).first()

    

    const character = Character.query()
      .withGraphJoined('book')
      .findById(saveCharacters.uuid)

    return character
  }

  static async updateLineColor (characterId, data) {
    var character = await Character.query()
      .patch({ line_color: data.color })
      .where('id', '=', characterId)

    character = Character.query()
      .where('id', '=', characterId).first()

    return character
  }

  static async hideStoryline (characterId, data) {
    var row = await Character.query()
      .where('id', '=', characterId).first()

    var character = await Character.query()
      .patch({ storyline_hidden: !row.storyline_hidden })
      .where('id', '=', characterId)

    row.storyline_hidden = !row.storyline_hidden
    return row
  }

  static async delete (characterId) {
    const character = await Character.query().softDeleteById(characterId)

    await RelationDetail.query()
      .where('character_id', characterId)
      .orWhere('character_relation_id', characterId)
      .patch({
        deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString()
      })

    return character
  }

  static async getSyncable (params) {
    var userId = params.query.userID
    var bookUUID = params.query.parent_uuid

    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })
    /*
    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)
      .whereNull('books.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }
    */

    const rows = await Character.query()
      .where('book_id', '=', bookUUID)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (datas) {
    var rows = []
    if (!Array.isArray(datas)) rows.push(datas)
    else rows = datas

    for (let i = 0; i < rows.length; i++) {
      var row = rows[i]
      var columns = {
        uuid: row.uuid,
        book_id: row.book_id,
        shortname: row.shortname,
        fullname: row.fullname,
        nickname: row.nickname,
        birthdate: row.birthdate,
        occupation: row.occupation,
        description: row.description,
        bio: row.bio,
        goals: row.goals,
        picture: row.picture,
        line_color: row.line_color,
        storyline_hidden: row.storyline_hidden,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
        from_local: row.from_local
      }
      var data = await Character.query()
        .patch(columns)
        .where('uuid', '=', row.uuid)

      if (!data || data === 0) {
        data = await Character.query().insert(columns)

        // update uuid to match web
        data = await Character.query()
          .patch({'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at})
          .where('uuid', '=', data.uuid)
      }
    }

    return true
  }
}

module.exports = {
  CharacterController
}
