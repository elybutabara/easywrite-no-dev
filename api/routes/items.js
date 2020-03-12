'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { ItemController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const item = await ItemController.save(req.body)

  if (item.pictures) {
    item.picture_src = 'file://' + path.resolve(__dirname, '../..', 'resources', 'images', 'items', item.pictures)
  }

  res
    .status(200)
    .json(item)
})

router.get('/:itemId', async function (req, res) {
  const item = await ItemController.getByItemId(req.params.itemId)

  if (item.pictures) {
    item.picture_src = 'file://' + path.resolve(__dirname, '../..', 'resources', 'images', 'items', item.pictures)
  }

  res
    .status(200)
    .json(item)
})

router.delete('/:itemId', async function (req, res) {
  const location = await ItemController.delete(req.params.itemId)

  res
    .status(200)
    .json(location)
})

router.post('/sync', async function (req, res) {
  const row = await ItemController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
