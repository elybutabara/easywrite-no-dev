'use strict'
const path = require('path')

const { Character } = require(path.join(__dirname, '..', 'models'))

class CharacterController {
  static getAllByBookId (bookId) {
    var characters = Character.query()
      .where('book_id', bookId)
      .whereNull('deleted_at')

    return characters
  }
}

module.exports = {
  CharacterController
}
