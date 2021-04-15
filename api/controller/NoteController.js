'use strict'
const path = require('path')
const moment = require('moment')

const { Book, Note, Chapter, Scene, Reader, User, Author, BookGenre, BookGenreCollection} = require(path.join(__dirname, '..', 'models'))

class NoteController {
  static getAllNotesByBookId (authorId, bookId) {
    var feedbacks = Note.query()
      .where('parent', 'book')
      .where('parent_id', bookId)
      .where('author_id', authorId)
      .withGraphJoined('author', {maxBatchSize: 1})
      .orderBy('id', 'asc')

    return feedbacks
  }

  static getAllNotesByChapterId (authorId, chapterId) {
    var feedbacks = Note.query()
      .where('parent', 'chapter')
      .where('parent_id', chapterId)
      .where('author_id', authorId)
      .withGraphJoined('author', {maxBatchSize: 1})
      .orderBy('id', 'asc')

    return feedbacks
  }

  static getAllNotesBySceneId (authorId, sceneId) {
    var feedbacks = Note.query()
      .where('parent', 'scene')
      .where('parent_id', sceneId)
      .where('author_id', authorId)
      .withGraphJoined('author', {maxBatchSize: 1})
      .orderBy('id', 'asc')

    return feedbacks
  }

  static async getAllNotesByAuthor (authorId) {
    var notes = await Note.query()
      .where('notes.message', '!=', '')
      .where('notes.author_id', authorId)
      .whereNull('notes.deleted_at')
      .withGraphJoined('author', {maxBatchSize: 1})
      .orderBy('id', 'asc')

    if (!notes) return

    // get book readers - books the user is reading
    var bookIRead = await Reader.query().where('author_id', authorId).where('status', 1).pluck('book_id')
    var notDeletedLinkOnNote = []
    for (let i = 0; i < notes.length; i++) {
      let parent = notes[i].parent
      let parentID = notes[i].parent_id

      if (parent === 'chapter') {
        notes[i].chapter = await Chapter.query().findById(parentID).whereNull('deleted_at')
        notes[i].scene = null
        if (notes[i].chapter) {
          notes[i].book = await Book.query().findById(notes[i].chapter.book_id).whereNull('deleted_at').whereNotIn('uuid', bookIRead)
          if (notes[i].book) {
            notDeletedLinkOnNote.push(notes[i])
          }
        }
      } else if (parent === 'scene') {
        notes[i].scene = await Scene.query().findById(parentID).whereNull('deleted_at')
        notes[i].chapter = notes[i].scene ? await Chapter.query().findById(notes[i].scene.chapter_id).whereNull('deleted_at') : ''
        if (notes[i].chapter) {
          notes[i].book = await Book.query().findById(notes[i].scene.book_id).whereNull('deleted_at').whereNotIn('uuid', bookIRead)
          if (notes[i].book) {
            notDeletedLinkOnNote.push(notes[i])
          }
        }
      } else if (parent === 'book') {
        notes[i].chapter = null
        notes[i].scene = null
        notes[i].book = await Book.query().findById(parentID).whereNull('deleted_at').whereNotIn('uuid', bookIRead)
        if (notes[i].book) {
          var genreUUIDs = []
          var genreC = await BookGenreCollection.query().select('genre_id').where('book_id', parentID)
          for (let i = 0; i < genreC.length; i++) {
            genreUUIDs.push(genreC[i].genre_id)
          }
          notes[i].book.genre = await BookGenre.query().select('id', 'name').whereIn('uuid', genreUUIDs)
          notes[i].book.author = await Author.query().findById(notes[i].book.author_id)
          notDeletedLinkOnNote.push(notes[i])
        }
      }
    }

    return notDeletedLinkOnNote
  }

  static async delete (noteId) {
    /* let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss').toString()
    const note = await Note.query().upsertGraph([{ message: '', uuid: noteId, updated_at: updatedAt }]).first()

    var row = Note.query()
      .where('notes.uuid', note.uuid)
      .withGraphJoined('author', {maxBatchSize: 1})
      .first()

    return row
    */
    const note = await Note.query().softDeleteById(noteId)

    return note
  }

  static async save (data) {
    if (data.updated_at) delete data.updated_at
    const note = await Note.query().upsertGraph([data]).first()

    var row = Note.query()
      .where('notes.uuid', note.uuid)
      .withGraphJoined('author', {maxBatchSize: 1})
      .first()

    return row
  }

  static async getSyncable (params) {
    var userId = params.query.userID

    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    var parentIDs = []
    /*
    // get all "my books" IDs
    const books = await Book.query()
      .select('uuid')
      .where('uuid','=', bookUUID)
      .where('author_id', user.author.uuid)

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
      parentIDs.push(books[i].uuid)
    }

    // get all "books i read" IDs
    const booksIRead = await Reader.query()
      .where('author_id', user.author.uuid)

    for (let i = 0; i < booksIRead.length; i++) {
      bookUUIDs.push(booksIRead[i].book_id)
      parentIDs.push(booksIRead[i].book_id)
    }

    parentIDs.push(bookUUID)

    // get all "chapters" IDs
    const chapters = await Chapter.query()
      .where('book_id','=', bookUUID)

    for (let i = 0; i < chapters.length; i++) {
      parentIDs.push(chapters[i].uuid)
    }

    // get all "scenes" IDs
    const scenes = await Scene.query()
      .where('book_id','=', bookUUID)

    for (let i = 0; i < scenes.length; i++) {
      parentIDs.push(scenes[i].uuid)
    }
     */

    const rows = await Note.query()
      .where('author_id', '=', user.author.uuid)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (datas) {
    var rows = []
    if (!Array.isArray(datas)) rows.push(datas)
    else rows = datas

    for (let i = 0; i < rows.length; i++) {
      var row = rows[i]
      var columns = {
        uuid: row.uuid,
        author_id: row.author_id,
        parent_id: row.parent_id,
        parent: row.parent,
        message: row.message,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at
      }
      var data = await Note.query()
        .patch(columns)
        .where('uuid', '=', row.uuid)

      if (!data || data === 0) {
        data = await Note.query().insert(columns)

        // update uuid to match web
        data = await Note.query()
          .patch({'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at})
          .where('uuid', '=', data.uuid)
      }
    }

    return true
  }
}

module.exports = {
  NoteController
}
