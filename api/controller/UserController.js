'use strict'
const path = require('path')

// eslint-disable-next-line no-unused-vars
const { Author, User, Book } = require(path.join(__dirname, '..', 'models'))

class UserController {
  static authenticate (username, password) {
    const user = User.query()
      .withGraphJoined('author', { maxBatchSize: 1 })
      .where('username', username)
      .where('password', password)
      .first()

    return user
  }

  static async save (row) {
    var data = await User.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      var user = await User.query().insert(row)
      var author = await Author.query().insert(row.author)

      console.log(user)
      console.log(author)

      // update uuid to match web
      data = await User.query()
        .patch({'uuid': row.uuid})
        .where('uuid', '=', user.uuid)

        // update uuid to match web
      data = await Author.query()
        .patch({ 'uuid': row.author.uuid })
        .where('uuid', '=', author.uuid)
    }

    data = await User.query().findById(row.uuid)

    // const saveUser = await User.query().upsertGraph([row]).first()

    /*
    const book = Book.query()
      .withGraphJoined('genre')
      .findById(saveBook.id)
    */

    return data
  }
}

module.exports = {
  UserController
}
