'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class BookRelationDetail extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_relation_details'
  }

  static get idColumn () { return ['uuid'] }

    static relationMappings = {
      character: {
        relation: BaseModel.HasOneRelation,
        modelClass: path.join(__dirname, 'Character'),
        join: {
          from: 'relation_details.character_id',
          to: 'characters.id'
        }
      },
      character_relation: {
        relation: BaseModel.HasOneRelation,
        modelClass: path.join(__dirname, 'Character'),
        join: {
          from: 'relation_details.character_relation_id',
          to: 'characters.id'
        }
      },
      relation: {
        relation: BaseModel.HasOneRelation,
        modelClass: path.join(__dirname, 'Relation'),
        join: {
          from: 'relation_details.relation_id',
          to: 'relations.id'
        }
      }
    }
}

module.exports = {
  BookRelationDetail
}
