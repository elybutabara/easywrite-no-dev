'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { AssignmentManuscriptController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const assignmnetManuscript = await AssignmentManuscriptController.save(req.body)

  res
    .status(200)
    .json(assignmnetManuscript)
})

router.delete('/:manuscriptId', async function (req, res) {
  const assignmnetManuscript = await AssignmentManuscriptController.delete(req.params.manuscriptId)

  res
    .status(200)
    .json(assignmnetManuscript)
})

module.exports = router
