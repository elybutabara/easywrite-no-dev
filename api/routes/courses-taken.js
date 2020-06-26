'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { CourseTakenController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:userId/assignments', async function (req, res) {
  let data = {
    userId: req.params.userId
  }

  const assignments = await CourseTakenController.getAssignments(data)

  res
    .status(200)
    .json(assignments)
})

module.exports = router
