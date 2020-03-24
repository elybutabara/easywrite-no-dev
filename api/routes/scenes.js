'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { SceneController, SceneVersionController, SceneCharacterController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:sceneId/characters', async function (req, res) {
  const sceneCharacters = await SceneCharacterController.getAllSceneCharactersBySceneId(req.params.sceneId)

  res
    .status(200)
    .json(sceneCharacters)
})

router.get('/:sceneId/versions', async function (req, res) {
  const sceneVersions = await SceneVersionController.getAllSceneVersionsBySceneId(req.params.sceneId)

  if (sceneVersions) {
    let currentVersion = sceneVersions[sceneVersions.length - 1]

    sceneVersions.forEach(function (item, index) {
      sceneVersions[index].is_same = false
      if (currentVersion.content === item.content) {
        sceneVersions[index].is_same = true
      }
    })
  }

  res
    .status(200)
    .json(sceneVersions)
})

router.post('/', async function (req, res) {
  const scene = await SceneController.save(req.body)

  res
    .status(200)
    .json(scene)
})

router.get('/:sceneId', async function (req, res) {
  const scene = await SceneController.getSceneById(req.params.sceneId)

  res
    .status(200)
    .json(scene)
})

router.delete('/:sceneId', async function (req, res) {
  const scene = await SceneController.delete(req.params.sceneId)

  res
    .status(200)
    .json(scene)
})

router.post('/sync', async function (req, res) {
  const row = await SceneController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
