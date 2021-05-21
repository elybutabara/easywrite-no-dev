'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class UserTreadline extends BaseModel {
    // Table name is the only required property.
    static get tableName () {
      return 'user_treadline'
    }
  
    static get idColumn () { return ['uuid'] }

    static relationMappings = {
        admin_treadline: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: path.join(__dirname, 'User'),
            join: {
            to: 'user_treadline.user_id',
            from: 'users.uuid'
            },
            softDelete: false
        }
    };

    static relationMappings = {
        admin_treadline: {
            relation: BaseModel.BelongsToOneRelation,
            modelClass: path.join(__dirname, 'Book'),
            join: {
            to: 'user_treadline.book_id',
            from: 'books.uuid'
            },
            softDelete: false
        }
    };
  
}
  
module.exports = {
    UserTreadline
}