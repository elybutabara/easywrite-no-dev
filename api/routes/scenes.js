'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { SceneController, SceneVersionController, SceneCharacterController, SceneLocationController, SceneItemController, BookSceneHistoryController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:sceneId/items', async function (req, res) {
  const sceneItems = await SceneItemController.getAllSceneItemsBySceneId(req.params.sceneId)

  res
    .status(200)
    .json(sceneItems)
})

router.get('/:sceneId/characters', async function (req, res) {
  const sceneCharacters = await SceneCharacterController.getAllSceneCharactersBySceneId(req.params.sceneId)

  // picture src
  sceneCharacters.forEach(function (item, index) {
    sceneCharacters[index].character.picture_src = ''
    if (item.character.picture) {
      sceneCharacters[index].character.picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'characters', item.character.picture)
    }
  })

  res
    .status(200)
    .json(sceneCharacters)
})

router.get('/:sceneId/locations', async function (req, res) {
  const sceneLocations = await SceneLocationController.getAllSceneLocationsBySceneId(req.params.sceneId)

  res
    .status(200)
    .json(sceneLocations)
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

router.get('/:sceneId/history', async function (req, res) {
  const sceneHistory = await BookSceneHistoryController.getAllSceneHistoryBySceneId(req.params.sceneId)

  res
    .status(200)
    .json(sceneHistory)
})

router.get('/:sceneId/book-chapter', async function (req, res) {
  const sceneHistory = await SceneController.getSceneByIdWithBookandChapter(req.params.sceneId)

  res
    .status(200)
    .json(sceneHistory)
})

router.post('/', async function (req, res) {
  const scene = await SceneController.save(req.body)

  res
    .status(200)
    .json(scene)
})

router.post('/:sceneId/hide-storyline', async function (req, res) {
  const scene = await SceneController.hideStoryline(req.params.sceneId, req.body)

  res
    .status(200)
    .json(scene)
})

router.post('/:sceneId/children', async function (req, res) {
  const scene = await SceneController.saveChildren(req.params.sceneId, req.body)

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

router.get('/syncable', async function (req, res) {
  const rows = await SceneController.getSyncable(req)

  res
    .status(200)
    .json(rows)
})

router.post('/sort', async function (req, res) {
  const scenes = await SceneController.sort(req.body)

  res
    .status(200)
    .json(scenes)
})

router.post('/sync', async function (req, res) {
  const row = await SceneController.sync(req.body)

  res
    .status(200)
    .json(row)
})

router.post('/hide', async function (req, res) {
  const scene = await SceneController.hide(req.body)

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

module.exports = router
