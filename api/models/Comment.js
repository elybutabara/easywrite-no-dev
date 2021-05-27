'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Comment extends BaseModel {
    // Table name is the only required property.
    static get tableName () {
        return 'comments'
    }

    static relationMappings = {
        author: {
            relation: BaseModel.HasOneRelation,
            modelClass: path.join(__dirname, 'Author'),
            join: {
                from: 'comments.author_id',
                to: 'authors.uuid'
            },
            softDelete: true
        },

        sub_comments: {
            relation: BaseModel.HasManyRelation,
            modelClass: path.join(__dirname, 'Comment'),
            join: {
                from: 'comments.uuid',
                to: 'comments.comment_id'
            },
            softDelete: true
        },
    }
}

module.exports = {
    Comment
};
