'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class BookSceneCharacter extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_scene_characters'
  }

  static get idColumn () { return ['uuid'] }

    static relationMappings = {
      scene: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'BookScene'),
        join: {
          from: 'book_scene_characters.book_scene_id',
          to: 'book_scenes.uuid'
        }
      },
      character: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'BookCharacter'),
        join: {
          from: 'book_scene_characters.character_id',
          to: 'book_characters.uuid'
        }
      }
    }
}

module.exports = {
  BookSceneCharacter
}
