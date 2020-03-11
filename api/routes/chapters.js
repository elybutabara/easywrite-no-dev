'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { ChapterController, SceneController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:chapterId/scenes', async function (req, res) {
  const scenes = await SceneController.getAllSceneByChapterId(req.params.chapterId)

  res
    .status(200)
    .json(scenes)
})

router.post('/sync', async function (req, res) {
  const row = await ChapterController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
