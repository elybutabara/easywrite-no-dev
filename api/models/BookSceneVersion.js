'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class BookSceneVersion extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_scene_versions'
  }

  static get idColumn () { return ['uuid'] }

    static relationMappings = {
      scene: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Scene'),
        join: {
          from: 'book_scene_versions.scene_id',
          to: 'book_scenes.uuid'
        }
      }
    }
}

module.exports = {
  BookSceneVersion
}
