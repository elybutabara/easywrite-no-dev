'use strict'
const path = require('path')
const moment = require('moment')
const { app } = require('electron')
// eslint-disable-next-line no-unused-vars
const { Author, AuthorName, User, Book } = require(path.join(__dirname, '..', 'models'))

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

      // console.log(user)
      // console.log(author)

      // update uuid to match web
      data = await User.query()
        .patch({'uuid': row.uuid})
        .where('uuid', '=', user.uuid)

        // update uuid to match web
      data = await Author.query()
        .patch({ 'uuid': row.author.uuid })
        .where('uuid', '=', author.uuid)
    }

    user = await User.query().findById(row.uuid).withGraphJoined('author')

    return user
  }

  static async saveAuthorDetails (row) {
    var data = await AuthorName.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await AuthorName.query().insert(row)

      // update uuid to match web
      data = await AuthorName.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }

  static async saveSyncedDate (params) {
    let lastSyncedDate
    if (app.getVersion() == '0.1.30') {
      lastSyncedDate = '1970-01-01 00:00:01'
    } else {
      lastSyncedDate = moment().add(5, 'seconds').format('YYYY-MM-DD HH:mm:ss').toString()
    }
    await User.query()
      .patch({synced_at: lastSyncedDate})
      .where('uuid', '=', params.uuid)

    let ret = await User.query().findById(params.uuid)

    return ret
  }
}

module.exports = {
  UserController
}
