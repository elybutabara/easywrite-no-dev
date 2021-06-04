'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { AppSettingsController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/:userId/increase-app-counter', async function (req, res) {
  const data = await AppSettingsController.increaseCounter(req.params.userId)
  res
    .status(200)
    .json(data)
})

router.post('/', async function (req, res) {
  const data = await AppSettingsController.save(req.body)
  res
    .status(200)
    .json(data)
})

router.get('/:userId', async function (req, res) {
  const data = await AppSettingsController.getAppSettings(req.params.userId)
  res
    .status(200)
    .json(data)
})

module.exports = router
