// import all models here...
const book = require('./models/book.js')
const chapter = require('./models/chapter.js')
const character = require('./models/character.js')
const item = require('./models/item.js')
const location = require('./models/location.js')
const scene = require('./models/scene.js')
const user = require('./models/user.js')

var sqlite3 = require('sqlite3').verbose()
let db

if (!db || !db.open) {
  // eslint-disable-next-line no-path-concat
  db = new sqlite3.Database(__dirname + '/base.db')
  // eslint-disable-next-line no-path-concat
}

// db.close();
this.loadApi = function (mainWindow) {
  // eslint-disable-next-line no-undef
  mainWindow.webContents.on('did-finish-load', () => {
    // eslint-disable-next-line no-undef
    mainWindow.webContents.send('ping', 'whoooooooh!')
  })

  // eslint-disable-next-line no-undef
  mainWindow.webContents.on('ipc-message', (event, channel, args) => {
    /*
    console.log('IPC-MESSAGE: ' + channel)
    console.log('IPC-MESSAGE ARGS: ' + args)

    if (channel === '/books/get') {
      let books
      books = book.getAuthorBooks(db, args)
      event.sender.send(channel, 'RESPONSE FROM IPC' + books)
    }
    */
  })

  // eslint-disable-next-line no-undef
  mainWindow.webContents.on('ipc-message-sync', async (event, channel, args) => {
    if (channel === 'AUTHENTICATE') {
      event.returnValue = await user.authenticate(db, args)
    } else if (channel === 'GET_BOOKS_BY_AUTHOR') {
      event.returnValue = await book.getBooksByAuthorID(db, args)
    } else if (channel === 'GET_CHAPTERS_BY_BOOK') {
      event.returnValue = await chapter.getChaptersByBookID(db, args)
    } else if (channel === 'GET_ITEMS_BY_BOOK') {
      event.returnValue = await item.getItemsByBookID(db, args)
    } else if (channel === 'GET_CHARACTERS_BY_BOOK') {
      event.returnValue = await character.getCharactersByBookID(db, args)
    } else if (channel === 'GET_LOCATIONS_BY_BOOK') {
      event.returnValue = await location.getLocationsByBookID(db, args)
    } else if (channel === 'GET_OTHER_SCENES_BY_BOOK') {
      event.returnValue = await scene.getOtherScenesByBookID(db, args)
    } else if (channel === 'GET_SCENES_BY_CHAPTER') {
      event.returnValue = await scene.getScenesByChapterID(db, args)
    }
  })
}
