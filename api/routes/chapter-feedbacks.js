'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { ChapterFeedbackController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/update-status', async function (req, res) {
  const feedback = await ChapterFeedbackController.updateStatus(req.body)

  res
    .status(200)
    .json(feedback)
})

router.post('/', async function (req, res) {
  const feedback = await ChapterFeedbackController.save(req.body)

  res
    .status(200)
    .json(feedback)
})

router.delete('/:ID', async function (req, res) {
  const character = await ChapterFeedbackController.delete(req.params.ID)

  res
    .status(200)
    .json(character)
})

router.get('/syncable', async function (req, res) {
  const rows = await ChapterFeedbackController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.get('/:chapterId', async function (req, res) {
  const rows = await ChapterFeedbackController.getAllFeedbackByChapterId(req.params.chapterId)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await ChapterFeedbackController.sync(req.body)

  res
    .status(200)
    .json(row)
})
/*
router.get('/:readerID', async function (req, res) {
  const reader = await ReaderController.getByReader(req.params.readerID)

  res
    .status(200)
    .json(reader)
})
*/
module.exports = router
