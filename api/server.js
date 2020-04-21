'use strict'

/*
* References about this module:
* https://expressjs.com/en/starter/basic-routing.html
* */
let initexpress = require('express')
let log = require('electron-log')
let { app } = require('electron')
let express = initexpress()
const fs = require('fs-extra')

const path = require('path')

// reference: http://expressjs.com/en/5x/api.html#req.body
const bodyParser = require('body-parser')
const multer = require('multer') // v1.0.5
express.use(bodyParser.json({ limit: '10mb' })) // for parsing application/json
express.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
express.use(function (req, res, next) {
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

express.use('/authors', require('./routes/authors'))
express.use('/users', require('./routes/users'))
express.use('/book-genres', require('./routes/book-genres'))
express.use('/relations', require('./routes/relations'))
express.use('/books', require('./routes/books'))
express.use('/items', require('./routes/items'))
express.use('/locations', require('./routes/locations'))
express.use('/book-genre-collections', require('./routes/book-genre-collections'))
express.use('/chapters', require('./routes/chapters'))
express.use('/chapter-versions', require('./routes/chapter-versions'))
express.use('/characters', require('./routes/characters'))
express.use('/relation-details', require('./routes/relation-details'))
express.use('/scenes', require('./routes/scenes'))
express.use('/scene-versions', require('./routes/scene-versions'))
express.use('/scene-items', require('./routes/scene-items'))
express.use('/scene-locations', require('./routes/scene-locations'))
express.use('/scene-characters', require('./routes/scene-characters'))
express.use('/author-personal-progress', require('./routes/author-personal-progress'))

express.post(
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
express.portNumber = 3000;
function listen(port) {
  express.portNumber = port;
  express.listen(port, () => {
    console.log("server is running on port :" + express.portNumber);
  }).on('error', function (err) {
    if(err.errno === 'EADDRINUSE') {
      log.warn(`----- Port ${port} is busy, trying with port ${port + 1} -----`)
      app.exit(0)
      // listen(port + 1)
    } else {
      log.error(`Error running in port: ${port}`)
      log.error(err)
    }
  });
}

listen(express.portNumber);
