'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { ChapterVersionController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const version = await ChapterVersionController.save(req.body)

  res
    .status(200)
    .json(version)
})

router.post('/sync', async function (req, res) {
  const row = await ChapterVersionController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
