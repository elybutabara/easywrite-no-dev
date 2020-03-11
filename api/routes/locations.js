'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { LocationController } = require(path.resolve(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const location = await LocationController.save(req.body)

  if (location.pictures) {
    location.picture_src = 'file://' + path.resolve(__dirname, '../..', 'resources', 'images', 'locations', location.pictures)
  }

  res
    .status(200)
    .json(location)
})

router.get('/:locationId', async function (req, res) {
  const location = await LocationController.getByLocationId(req.params.locationId)

  if (location.pictures) {
    location.picture_src = 'file://' + path.resolve(__dirname, '../..', 'resources', 'images', 'locations', location.pictures)
  }

  res
    .status(200)
    .json(location)
})

router.delete('/:locationId', async function (req, res) {
  const location = await LocationController.delete(req.params.locationId)

  res
    .status(200)
    .json(location)
})

router.post('/sync', async function (req, res) {
  const row = await LocationController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
