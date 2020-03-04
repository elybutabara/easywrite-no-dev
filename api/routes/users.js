'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { UserController, BookController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/login', async function (req, res) {
  const user = await UserController.authenticate(req.query.username, req.query.password)

  if(user) {
    res
      .status(200)
      .json({
        user: user,
        author: user.author
      })
  }
  else {
    res
      .status(401)
      .json({
        message: 'Invalid usernamd or password...'
      })
  }
})

router.get('/:userId/books', async function (req, res) {
  const books = await BookController.getAllBooksByUserId(req.params.userId)

  res
    .status(200)
    .json(books)
})

module.exports = router
