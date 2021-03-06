'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { NotificationController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const data = await NotificationController.save(req.body)

  res
    .status(200)
    .json(data)
})

router.get('/read/:notificationId', async function (req, res) {
  const row = await NotificationController.read(req.params.notificationId)
  res
    .status(200)
    .json(row)
})

router.get('/syncable', async function (req, res) {
  const rows = await NotificationController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await NotificationController.sync(req.body)
  res
    .status(200)
    .json(row)
})

router.post('/update-notification-status', async function (req, res) {
  const row = await NotificationController.updateNotificationStatus(req.body)
  res
    .status(200)
    .json(row)
})

router.get('/:authorUuid', async function (req, res) {
  const data = await NotificationController.getAll(req.params.authorUuid)
  const response = {
    // 'count': data.notification.length + data.notification.length,
    'data': data
  }
  res
    .status(200)
    .json(response)
})

module.exports = router
