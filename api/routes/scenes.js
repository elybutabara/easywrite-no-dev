'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { SceneController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/sync', async function (req, res) {
  const row = await SceneController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
