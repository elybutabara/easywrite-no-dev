'use strict'

/*
* References about this module:
* https://expressjs.com/en/starter/basic-routing.html
* */
let express = require('express')
let app = express()

// reference: http://expressjs.com/en/5x/api.html#req.body
const bodyParser = require('body-parser')
app.use(bodyParser.json({ limit: '10mb' })) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/books', require('./routes/books'))
app.use('/users', require('./routes/users'))
app.use('/book-chapters', require('./routes/book-chapters'))
app.use('/book-chapter-versions', require('./routes/book-chapter-versions'))
app.use('/book-genres', require('./routes/book-genres'))
app.use('/book-relations', require('./routes/book-relations'))
app.use('/book-items', require('./routes/book-items'))
app.use('/book-locations', require('./routes/book-locations'))
app.use('/book-genre-collections', require('./routes/book-genre-collections'))
app.use('/book-characters', require('./routes/book-characters'))
app.use('/book-relation-details', require('./routes/book-relation-details'))
app.use('/book-scenes', require('./routes/book-scenes'))
app.use('/book-scene-versions', require('./routes/book-scene-versions'))
app.use('/book-scene-items', require('./routes/book-scene-items'))
app.use('/book-scene-locations', require('./routes/book-scene-locations'))
app.use('/book-scene-characters', require('./routes/book-scene-characters'))

app.listen(3000, function () {
  console.log('Server is running on port 3000')
})
