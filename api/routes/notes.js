'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { NoteController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const feedback = await NoteController.save(req.body)

  res
    .status(200)
    .json(feedback)
})

router.delete('/:ID', async function (req, res) {
  const character = await NoteController.delete(req.params.ID)

  res
    .status(200)
    .json(character)
})

router.get('/syncable', async function (req, res) {
  const rows = await NoteController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.get('/book/:parentId', async function (req, res) {
  const rows = await NoteController.getAllNotesByBookId(req.params.parentId)

  res
    .status(200)
    .json(rows)
})

router.get('/chapter/:parentId', async function (req, res) {
  const rows = await NoteController.getAllNotesByChapterId(req.params.parentId)

  res
    .status(200)
    .json(rows)
})

router.get('/scene/:parentId', async function (req, res) {
  const rows = await NoteController.getAllNotesBySceneId(req.params.parentId)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await NoteController.sync(req.body)

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
