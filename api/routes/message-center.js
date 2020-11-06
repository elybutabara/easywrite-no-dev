'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { MessageCenterController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:authorUuid', async function (req, res) {
  const data = await MessageCenterController.getAll(req.params.authorUuid)
  res
    .status(200)
    .json(data)
})

router.get('/read/:notificationId', async function (req, res) {
  const row = await MessageCenterController.read(req.params.notificationId)
  res
    .status(200)
    .json(row)
})

module.exports = router
