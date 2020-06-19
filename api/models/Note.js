'use strict'
const path = require('path')
const { BaseModel } = require('./BaseModel')

class Note extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'notes'
  }

  static relationMappings = {
    author: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Author'),
      join: {
        from: 'notes.author_id',
        to: 'authors.uuid'
      },
      softDelete: true
    }
  };
}

module.exports = {
  Note
}
