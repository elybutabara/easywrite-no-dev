'use strict'

/*
* References about this module:
* https://expressjs.com/en/starter/basic-routing.html
* */
let express = require('express')
let app = express()

// reference: http://expressjs.com/en/5x/api.html#req.body
const bodyParser = require('body-parser')
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const { ChapterController } = require('./controller/ChapterController')

app.get('/books/:bookId/chapters', async function (req, res) {
  const chapters = await ChapterController.getChapterByBookId(req.params.bookId)

  res
    .status(200)
    .json(chapters)
})

app.get('/chapters', async function (req, res) {
  const chapters = await ChapterController.getAll()

  console.log(chapters)
  res
    .status(200)
    .json(chapters)
})

app.listen(3000, function () {
  console.log('Server is running on port 3000')
})
