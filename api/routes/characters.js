'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { CharacterController, RelationDetailController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:characterId/relations', async function (req, res) {
  const relationDetail = await RelationDetailController.getRelationDetailByCharacterId(req.params.characterId)

  res
    .status(200)
    .json(relationDetail)
})

router.post('/', async function (req, res) {
  const character = await CharacterController.save(req.body)

  if (character.pictures) {
    character.picture_src = 'file://' + path.resolve(__dirname, '../..', 'resources', 'images', 'characters', character.pictures)
  }

  res
    .status(200)
    .json(character)
})

router.get('/:characterId', async function (req, res) {
  const character = await CharacterController.getByCharacterId(req.params.characterId)

  if (character.picture) {
    character.picture_src = 'file://' + path.resolve(__dirname, '../..', 'resources', 'images', 'characters', character.picture)
  }

  res
    .status(200)
    .json(character)
})

router.delete('/:characterId', async function (req, res) {
  const character = await CharacterController.delete(req.params.characterId)

  res
    .status(200)
    .json(character)
})

router.post('/sync', async function (req, res) {
  const row = await CharacterController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
