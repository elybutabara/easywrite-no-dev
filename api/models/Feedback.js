'use strict'
const path = require('path')
const { BaseModel } = require('./BaseModel')

class Feedback extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'feedbacks'
  }

  static relationMappings = {
    feedback_responses: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'FeedbackResponse'),
      join: {
        from: 'feedbacks.uuid',
        to: 'feedback_responses.feedback_id'
      },
      softDelete: true
    },
    author: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'AuthorName'),
      join: {
        from: 'feedbacks.author_id',
        to: 'author_names.uuid'
      },
      softDelete: false
    }
  };
}

module.exports = {
  Feedback
}
