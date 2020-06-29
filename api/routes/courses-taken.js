'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()

const { CourseTakenController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const courseTaken = await CourseTakenController.save(req.body)

  res
    .status(200)
    .json(courseTaken)
})

router.delete('/:courseId', async function (req, res) {
  const courseTaken = await CourseTakenController.delete(req.params.courseId)

  res
    .status(200)
    .json(courseTaken)
})

router.get('/syncable', async function (req, res) {
  const rows = await CourseTakenController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await CourseTakenController.sync(req.body)

  res
    .status(200)
    .json(row)
})

router.get('/:courseId', async function (req, res) {
  const courseTaken = await CourseTakenController.getByCourseId(req.params.courseId)

  if (courseTaken.pictures) {
    courseTaken.picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'courses', course.pictures)
  }

  res
    .status(200)
    .json(courseTaken)
})

module.exports = router
