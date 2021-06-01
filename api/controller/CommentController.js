'use strict'
const path = require('path')
const moment = require('moment')

const { Comment, Scene, Chapter } = require(path.join(__dirname, '..', 'models'))

class CommentController {

    static async filterComment (param) {

        let parentTableQuery = param.parent === 'scene' ? Scene.query() : Chapter.query();
        const bookAuthor = await parentTableQuery.findById(param.parent_id).withGraphJoined('book', { maxBatchSize: 1 });

        let comments = Comment.query();
        comments.withGraphJoined('author', {maxBatchSize: 1});
        comments.withGraphFetched('sub_comments.[author]', {maxBatchSize: 1});
        comments.modifyGraph('sub_comments', builder => {
            builder.whereNull('deleted_at')
            builder.orderBy('id')
        });
        comments.where('comments.parent', param.parent);
        comments.where('comments.parent_id', param.parent_id);

        // check if the current user is not the author of the book
        // add additional query to display only owned comment
        if (bookAuthor.book.author_id !== param.current_author) {
            comments.where('comments.author_id', param.current_author);
        }

        comments.whereNull('comments.deleted_at')
            .whereNull('comments.comment_id')
            .orderBy('comments.created_at', 'DESC');
        return comments;
    }

    static async save(data) {

        if (data.updated_at) delete data.updated_at;

        const saveComment = await Comment.query().upsertGraph([data]).first();

        let commentUUID = saveComment.uuid;

        // check if the request have a comment_id
        // then use the comment_id instead
        if (data.comment_id) {
            commentUUID = saveComment.comment_id;
        }

        return Comment.query()
            .withGraphJoined('author', {maxBatchSize: 1})
            .withGraphFetched('sub_comments.[author]', {maxBatchSize: 1})
            .modifyGraph('sub_comments', builder => {
                builder.whereNull('deleted_at')
                builder.orderBy('id')
            })
            .whereNull('comments.deleted_at')
            .orderBy('comments.created_at', 'DESC')
            .findById(commentUUID);

    }

    static async delete (itemId) {
        return await Comment.query().softDeleteById(itemId)
    }

}

module.exports = {
    CommentController
};