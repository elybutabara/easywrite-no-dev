'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

// const diffMatchPatch = require('diff-match-patch')

const { ChapterController, SceneController, ChapterVersionController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:chapterId/scenes', async function (req, res) {
  const scenes = await SceneController.getAllSceneByChapterId(req.params.chapterId)

  res
    .status(200)
    .json(scenes)
})

router.get('/:chapterId/versions', async function (req, res) {
  const chapterVersions = await ChapterVersionController.getAllChapterVersionsByChapterId(req.params.chapterId)

  if (chapterVersions) {
    let currentVersion = chapterVersions[chapterVersions.length - 1]

    chapterVersions.forEach(function (item, index) {
      chapterVersions[index].is_same = false
      if (currentVersion.content === item.content) {
        chapterVersions[index].is_same = true
      }
    })
  }
  res
    .status(200)
    .json(chapterVersions)
})

router.post('/', async function (req, res) {
  const chapter = await ChapterController.save(req.body)

  res
    .status(200)
    .json(chapter)
})

router.get('/:chapterId', async function (req, res) {
  const chapter = await ChapterController.getChapterById(req.params.chapterId)

  res
    .status(200)
    .json(chapter)
})

router.post('/sync', async function (req, res) {
  const row = await ChapterController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
