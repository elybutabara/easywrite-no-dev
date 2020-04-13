'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { UserController, BookController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/login', async function (req, res) {
  const user = await UserController.authenticate(req.query.username, req.query.password)

  if (user) {
    res
      .status(200)
      .json({
        user: user,
        author: user.author
      })
  } else {
    res
      .status(401)
      .json({
        message: 'Invalid username or password...'
      })
  }
})

router.post('/', async function (req, res) {
  const user = await UserController.save(req.body)

  res
    .status(200)
    .json(user)
})

router.post('/synced', async function (req, res) {
  const user = await UserController.saveSyncedDate(req.body)

  res
    .status(200)
    .json(user)
})

router.get('/getuser', async function (req, res) {
  const user = await UserController.getUser()

  res
    .status(200)
    .json(user)
})

router.get('/:userId/books', async function (req, res) {
  const books = await BookController.getAllBooksByUserId(req.params.userId)

  const genres = await BookController.getAllBookGenres()

  books.forEach(function (item, index) {
    if (item.book_genre_collection) {
      const genre = []
      item.book_genre_collection.forEach(function (collection, indx) {
        if (genres.find(x => (x.uuid === collection.genre_id)) !== undefined) {
          var selectedGenre = genres.find(x => (x.uuid === collection.genre_id))
          genre.push({
            uuid: selectedGenre.uuid,
            name: selectedGenre.name
          })
        }
      })
      books[index].genre = genre
    }
  })

  res
    .status(200)
    .json(books)
})

module.exports = router
