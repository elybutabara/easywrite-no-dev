'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { SceneCharacterController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const sceneCharacter = await SceneCharacterController.save(req.body)

  res
    .status(200)
    .json(sceneCharacter)
})

router.post('/sync', async function (req, res) {
  const row = await SceneCharacterController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
