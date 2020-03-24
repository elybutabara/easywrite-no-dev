'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { SceneVersionController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const version = await SceneVersionController.save(req.body)

  res
    .status(200)
    .json(version)
})

router.post('/sync', async function (req, res) {
  const row = await SceneVersionController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
