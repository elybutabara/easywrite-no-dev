'use strict'
const path = require('path')
const { BaseModel } = require('./BaseModel')

class Notification extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'notifications'
  }

  static relationMappings = {
    fromAuthor: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Author'),
      join: {
        from: 'notifications.from',
        to: 'authors.uuid'
      },
      softDelete: true
    },
    toAuthor: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Author'),
      join: {
        from: 'notifications.to',
        to: 'authors.uuid'
      },
      softDelete: true
    },
    book: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Book'),
      join: {
        from: 'notifications.book_id',
        to: 'books.uuid'
      },
      softDelete: true
    }
  }
}

module.exports = {
  Notification
}
