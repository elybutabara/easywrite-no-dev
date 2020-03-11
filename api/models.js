const path = require('path')

const Knex = require('knex')
const { Model } = require('objection')

const connection = require(path.join('../src/knexfile'))[process.env.NODE_ENV]
const knexConnection = Knex(connection)

const { Author } = require(path.join(__dirname, 'models/Author'))
const { User } = require(path.join(__dirname, 'models/User'))
const { Book } = require(path.join(__dirname, 'models/Book'))
const { BookChapter } = require(path.join(__dirname, 'models/BookChapter'))
const { BookScene } = require(path.join(__dirname, 'models/BookScene'))
const { BookCharacter } = require(path.join(__dirname, 'models/BookCharacter'))
const { BookItem } = require(path.join(__dirname, 'models/BookItem'))
const { BookLocation } = require(path.join(__dirname, 'models/BookLocation'))
const { BookGenre } = require(path.join(__dirname, 'models/BookGenre'))
const { BookGenreCollection } = require(path.join(__dirname, 'models/BookGenreCollection'))
const { BookChapterVersion } = require(path.join(__dirname, 'models/BookChapterVersion'))
const { BookSceneVersion } = require(path.join(__dirname, 'models/BookSceneVersion'))
const { BookRelation } = require(path.join(__dirname, 'models/BookRelation'))
const { BookRelationDetail } = require(path.join(__dirname, 'models/BookRelationDetail'))
const { BookSceneCharacter } = require(path.join(__dirname, 'models/BookSceneCharacter'))
const { BookSceneItem } = require(path.join(__dirname, 'models/BookSceneItem'))
const { BookSceneLocation } = require(path.join(__dirname, 'models/BookSceneLocation'))
const { SoftDeleteQueryBuilder } = require(path.join(__dirname, 'models/SoftDeleteQueryBuilder'))

Model.knex(knexConnection)

module.exports = {
  Author,
  User,
  Book,
  BookChapter,
  BookChapterVersion,
  BookScene,
  BookCharacter,
  BookItem,
  BookLocation,
  BookGenre,
  BookGenreCollection,
  BookSceneVersion,
  BookRelation,
  BookRelationDetail,
  BookSceneCharacter,
  BookSceneItem,
  BookSceneLocation,
  SoftDeleteQueryBuilder
}
