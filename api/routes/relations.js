'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { RelationController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const relation = await RelationController.save(req.body)

  res
    .status(200)
    .json(relation)
})

router.get('/', async function (req, res) {
  const relations = await RelationController.getAll()

  res
    .status(200)
    .json(relations)
})

router.post('/sync', async function (req, res) {
  const row = await RelationController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
