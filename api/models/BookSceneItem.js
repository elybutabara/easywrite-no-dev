'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class BookSceneItem extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'book_scene_items'
  }

  static get idColumn () { return ['uuid'] }

    static relationMappings = {
      scene: {
        relation: BaseModel.HasOneRelation,
        modelClass: path.join(__dirname, 'Scene'),
        join: {
          from: 'book_scene_items.scene_id',
          to: 'book_scenes.uuid'
        }
      },
      item: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Item'),
        join: {
          from: 'book_scene_items.item_id',
          to: 'book_items.uuid'
        }
      }
    }
}

module.exports = {
  BookSceneItem
}
