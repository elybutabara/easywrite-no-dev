'use strict'
const path = require('path')

const { User, Book } = require(path.join(__dirname, '..', 'models'))

class UserController {
  static authenticate (username, password) {
    const user = User.query()
      .withGraphJoined('author', { maxBatchSize: 1 })
      .where('username', username)
      .where('password', password)
      .first()

    return user
  }
}

module.exports = {
  UserController
}
