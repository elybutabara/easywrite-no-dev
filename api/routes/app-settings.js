'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { AppSettingsController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const data = await AppSettingsController.save(req.body)

  res
    .status(200)
    .json(data)
})

module.exports = router
