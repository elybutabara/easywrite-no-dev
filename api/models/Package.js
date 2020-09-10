'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Package extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'packages'
  }

  static relationMappings = {
    course: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Course'),
      join: {
        from: 'packages.course_id',
        to: 'courses.uuid'
      }
    }
    // scene_item: {
    //   relation: BaseModel.HasManyRelation,
    //   modelClass: path.join(__dirname, 'SceneItem'),
    //   join: {
    //     from: 'book_items.uuid',
    //     to: 'book_scene_items.book_item_id'
    //   },
    //   softDelete: true
    // }
  }
}

module.exports = {
  Package
}
