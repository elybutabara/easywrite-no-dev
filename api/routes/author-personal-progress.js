'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { AuthorPersonalProgressController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const personalProgress = await AuthorPersonalProgressController.save(req.body)

  res
    .status(200)
    .json(personalProgress)
})

module.exports = router
