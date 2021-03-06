'use strict'
const path = require('path')

const express = require('express')
const { route } = require('./users')
const router = express.Router()

const { TreadlineController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/admin-treadline', async function (req, res) {
    const treadline = await TreadlineController.getAdminTreadline()
  
    res
      .status(200)
      .json(treadline)
  })

router.get('/:bookId/answers-by-book', async function (req, res){
    const answer = await TreadlineController.getAnswersByBook(req.params.bookId)

    res
      .status(200)
      .json(answer)
})

router.post('/save', async function (req, res){
    const save = await TreadlineController.save(req.body)

    res
      .status(200)
      .json(save)
})


router.get('/syncable', async function (req, res) {
  const rows = await TreadlineController.getSyncable(req)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
    const row = await TreadlineController.sync(req.body)
  
    res
      .status(200)
      .json(row)
})

module.exports = router