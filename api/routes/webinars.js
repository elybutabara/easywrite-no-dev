'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()

const { WebinarController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:courseID', async function (req, res) {
  const param = {
    courseID: req.params.courseID,
    search: ''
  }

  if (req.query.search) {
    param.search = req.query.search
  }

  const webinars = await WebinarController.getAllByCourseId(param)

  webinars.forEach(function (item, index) {
    if (item.image) {
      webinars[index].image_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'webinars', item.image.replace('/uploads/webinars/', ''))
    }
  })

  res
    .status(200)
    .json(webinars)
})

router.get('/syncable', async function (req, res) {
  const rows = await WebinarController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await WebinarController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
