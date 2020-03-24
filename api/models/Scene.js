'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Scene extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_scenes'
  }

  static relationMappings = {
    scene_version: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'SceneVersion'),
      join: {
        from: 'book_scenes.uuid',
        to: 'book_scene_versions.book_scene_id'
      }
    },
    scene_character: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'SceneCharacter'),
      join: {
        from: 'book_scenes.uuid',
        to: 'book_scene_characters.book_scene_id'
      }
    },
    scene_location: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'SceneLocation'),
      join: {
        from: 'book_scenes.uuid',
        to: 'book_scene_locations.book_scene_id'
      }
    },
    scene_item: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'SceneItem'),
      join: {
        from: 'book_scenes.uuid',
        to: 'book_scene_items.book_scene_id'
      }
    }
  }
}

module.exports = {
  Scene
}
