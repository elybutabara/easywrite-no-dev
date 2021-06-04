'use strict'
const path = require('path')

const express = require('express')
const { route } = require('./users')
const router = express.Router()

const { AdminTreadlineController,TreadlineController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/', async function (req, res) {
    const treadline = await AdminTreadlineController.getAdminTreadline()
  
    res
      .status(200)
      .json(treadline)
  })


router.get('/syncable', async function (req, res) {
  const rows = await AdminTreadlineController.getSyncable(req)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
    const row = await AdminTreadlineController.sync(req.body)
  
    res
      .status(200)
      .json(row)
})

module.exports = router