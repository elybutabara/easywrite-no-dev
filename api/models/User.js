'use strict';

const path = require('path');

const { BaseModel } = require('./BaseModel');

class User extends BaseModel {
    // Table name is the only required property.
    static get tableName() {
        return 'users';
    }

  static get idColumn() { return ["id"]; }

  static relationMappings = {
    author: {
      relation: BaseModel.HasOneRelation,
      modelClass: path.join(__dirname, 'Author'),
      join: {
        from: 'users.id',
        to: 'authors.user_id'
      }
    }
  }
}

module.exports = {
    User
};
