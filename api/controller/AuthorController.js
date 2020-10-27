'use strict'
const path = require('path')

const { Author } = require(path.join(__dirname, '..', 'models'))

class AuthorController {
  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      user_id: row.user_id,
      first_name: row.first_name,
      last_name: row.last_name,
      alias: row.alias,
      about_you: row.about_you,
      age: row.age,
      readers: row.readers,
      had_a_book: row.had_a_book,
      interest: row.interest,
      book_limit: row.book_limit,
      created_at: row.created_at,
      updated_at: row.updated_at
    }

    var data = await Author.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Author.query().insert(columns)

      // update uuid to match web
      data = await Author.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  AuthorController
}
