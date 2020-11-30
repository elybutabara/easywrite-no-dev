'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class AppSetting extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'app_settings'
  }

  static get idColumn () { return ['uuid'] }

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'User'),
      join: {
        from: 'app_settings.user_id',
        to: 'users.uuid'
      }
    }
  }
}

module.exports = {
  AppSetting
}
