'use strict'

/*
* References about this module:
* https://expressjs.com/en/starter/basic-routing.html
* */
let express = require('express')
let app = express()

const fs = require('fs-extra')

const path = require('path')

// reference: http://expressjs.com/en/5x/api.html#req.body
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
app.use(bodyParser.json({ limit: '10mb' })) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// eslint-disable-next-line handle-callback-err
const handleError = (err, res) => {
  res
    .status(500)
    .contentType('text/plain')
    .end('Oops! Something went wrong!')
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let imgOf = req.params.imgOf
      // eslint-disable-next-line camelcase
      let img_path = path.join('resources', 'images', imgOf)
      fs.mkdirsSync(img_path)
      callback(null, img_path)
    },
    filename: (req, file, callback) => {
      // originalname is the uploaded file's name with extn
      callback(null, file.originalname)
    }
  })
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
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

app.post(
  '/upload/:imgOf/image',
  upload.single('single-picture-file' /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path
    const targetPath = req.file.destination// path.join(__dirname, "/app/public/images/${req.params.imgOf}/");

    // eslint-disable-next-line camelcase
    const file_ext = path.extname(req.file.originalname).toLowerCase()

    // eslint-disable-next-line camelcase
    const allowed_ext = ['.png', '.jpg', '.jpeg']

    if (allowed_ext.includes(file_ext)) {
      const newPath = path.join(targetPath, req.file.filename)
      fs.rename(tempPath, newPath, err => {
        if (err) return handleError(err, res)

        res
          .status(200)
          .send({status: 200, message: 'File uploaded!', file: {name: req.file.filename, ext: file_ext}})
      })
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res)

        res
          .status(403)
          .send({status: 403, message: 'Only .png, .jpeg, .jpg files are allowed!'})
      })
    }
  }
)

app.listen(3000, function () {
  console.log('Server is running on port 3000')
})
