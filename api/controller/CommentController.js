'use strict'
const path = require('path')
const moment = require('moment')

const { Comment, Scene, Chapter, Notification } = require(path.join(__dirname, '..', 'models'))

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

        if (!data.id) {
            let parentTableQuery = data.parent === 'scene' ? Scene.query() : Chapter.query();
            const parentTable = await parentTableQuery.findById(data.parent_id).withGraphJoined('book', { maxBatchSize: 1 });
            const book = parentTable.book;

            let to = '';
            let action = '';
            // check if reply
            if (data.comment_id) {
                const mainComment = await this.getByCommentUUID(saveComment.comment_id);
                to = mainComment.author_id;
                action = 'reply';
            } else {
                to = book.author_id;
                action = 'post';
            }

            const from = saveComment.author_id;
            if (to !== from) {
                const notification = {
                    'from': from,
                    'to': to,
                    'book_id': book.uuid,
                    'parent_id': saveComment.uuid,
                    'parent_name': 'comment',
                    'action': action,
                    'type' : saveComment.parent === 'chapter' ? 'chapter_inline_comment' : 'scene_inline_comment',
                    'status': 0
                };
                await Notification.query().insert(notification)
            }
        }

        // check if the request have a comment_id
        // then use the comment_id instead
        if (data.comment_id) {
            commentUUID = saveComment.comment_id;
        }

        return this.getByCommentUUID(commentUUID);

    }

    static async getByCommentUUID(uuid) {
        return Comment.query()
            .withGraphJoined('author', {maxBatchSize: 1})
            .withGraphFetched('sub_comments.[author]', {maxBatchSize: 1})
            .modifyGraph('sub_comments', builder => {
                builder.whereNull('deleted_at')
                builder.orderBy('id')
            })
            .whereNull('comments.deleted_at')
            .orderBy('comments.created_at', 'DESC')
            .findById(uuid);
    }

    static async delete (itemId) {
        return await Comment.query().softDeleteById(itemId)
    }

}

module.exports = {
    CommentController
};