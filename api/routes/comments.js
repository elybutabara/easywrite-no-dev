'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { CommentController } = require(path.join(__dirname, '..', 'controllers'));

router.get('/chapter/:chapterId/author/:authorId', async function (req, res) {
    const param = {
        parent_id: req.params.chapterId,
        parent: 'chapter',
        current_author: req.params.authorId
    };

    const comments = await CommentController.filterComment(param);

    res
        .status(200)
        .json(comments)
});

router.get('/scene/:sceneId/author/:authorId', async function (req, res) {
    const param = {
        parent_id: req.params.sceneId,
        parent: 'scene',
        current_author: req.params.authorId
    };

    const comments = await CommentController.filterComment(param);

    res
        .status(200)
        .json(comments)
});

router.post('/', async function( req, res ) {
    const scene = await CommentController.save(req.body);

    res
        .status(200)
        .json(scene)
});

router.delete('/:commentId', async function (req, res) {
    const comment = await CommentController.delete(req.params.commentId)

    res
        .status(200)
        .json(comment)
})

module.exports = router;