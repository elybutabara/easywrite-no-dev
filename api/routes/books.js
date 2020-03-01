'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { ChapterController, ItemController, CharacterController, LocationController, SceneController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:bookId/chapters', async function (req, res) {
  const chapters = await ChapterController.getAllByBookId(req.params.bookId)

  res
    .status(200)
    .json(chapters)
})

router.get('/:bookId/items', async function (req, res) {
  const items = await ItemController.getAllByBookId(req.params.bookId)
  
  res
    .status(200)
    .json(items)
})

router.get('/:bookId/characters', async function (req, res) {
  const characters = await CharacterController.getAllByBookId(req.params.bookId)

  res
    .status(200)
    .json(characters)
})

router.get('/:bookId/locations', async function (req, res) {
  const locations = await LocationController.getAllByBookId(req.params.bookId)

  res
    .status(200)
    .json(locations)
})

router.get('/:bookId/scenes/other', async function (req, res) {
  const locations = await SceneController.getOtherScene(req.params.bookId)

  res
    .status(200)
    .json(locations)
})

module.exports = router
