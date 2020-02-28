const { Book, Chapter, Character, Item, Location, Scene, User } = require('./models')

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
      const user = await User.query()
        .withGraphJoined('author', { maxBatchSize: 1 })
        .where('username', args.username)
        .where('password', args.password)
        .first()

      if (typeof user !== 'undefined') {
        event.returnValue = {
          success: 1,
          user: user,
          author: user.author
        }
      } else {
        event.returnValue = { success: 0, message: 'Invalid usernamd or password...' }
      }
    } else if (channel === 'GET_BOOKS_BY_AUTHOR') {
      const books = await Book.query()
        .where('author_id', args.author_id)
        .whereNull('deleted_at')

      event.returnValue = books
    } else if (channel === 'GET_CHAPTERS_BY_BOOK') {
      const chapters = await Chapter.query()
        .where('book_id', args.book_id)
        .whereNull('deleted_at')

      event.returnValue = chapters
    } else if (channel === 'GET_ITEMS_BY_BOOK') {
      const items = await Item.query()
        .where('book_id', args.book_id)
        .whereNull('deleted_at')

      event.returnValue = items
    } else if (channel === 'GET_CHARACTERS_BY_BOOK') {
      const characters = await Character.query()
        .where('book_id', args.book_id)
        .whereNull('deleted_at')

      event.returnValue = characters
    } else if (channel === 'GET_LOCATIONS_BY_BOOK') {
      const locations = await Location.query()
        .where('book_id', args.book_id)
        .whereNull('deleted_at')

      event.returnValue = locations
    } else if (channel === 'GET_OTHER_SCENES_BY_BOOK') {
      const otherScenes = await Scene.query()
        .where('book_id', args.book_id)
        .whereRaw('chapter_id IS NULL OR chapter_id = ?', [0])
        .whereNull('deleted_at')

      event.returnValue = otherScenes
    } else if (channel === 'GET_SCENES_BY_CHAPTER') {
      const scenes = await Scene.query()
        .where('chapter_id', args.chapter_id)
        .whereNull('deleted_at')

      event.returnValue = scenes
    }
  })
}
