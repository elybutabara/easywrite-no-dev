const path = require('path')

const Knex = require('knex')
const { Model } = require('objection')

const connection = require(path.join(__dirname, 'knexfile'))[process.env.NODE_ENV]
const knexConnection = Knex(connection)
global.knexConnection = knexConnection // to be use in starter.js(main.js) for update versions

const { Author } = require(path.join(__dirname, 'models/Author'))
const { AuthorName } = require(path.join(__dirname, 'models/AuthorName'))
const { User } = require(path.join(__dirname, 'models/User'))
const { BookGenre } = require(path.join(__dirname, 'models/BookGenre'))
const { Relation } = require(path.join(__dirname, 'models/Relation'))
const { Book } = require(path.join(__dirname, 'models/Book'))
const { Chapter } = require(path.join(__dirname, 'models/Chapter'))
const { Feedback } = require(path.join(__dirname, 'models/Feedback'))
const { FeedbackResponse } = require(path.join(__dirname, 'models/FeedbackResponse'))
const { Note } = require(path.join(__dirname, 'models/Note'))
const { Scene } = require(path.join(__dirname, 'models/Scene'))
const { Character } = require(path.join(__dirname, 'models/Character'))
const { Item } = require(path.join(__dirname, 'models/Item'))
const { Location } = require(path.join(__dirname, 'models/Location'))
const { Reader } = require(path.join(__dirname, 'models/Reader'))
const { BookGenreCollection } = require(path.join(__dirname, 'models/BookGenreCollection'))
const { ChapterVersion } = require(path.join(__dirname, 'models/ChapterVersion'))
const { SceneVersion } = require(path.join(__dirname, 'models/SceneVersion'))
const { RelationDetail } = require(path.join(__dirname, 'models/RelationDetail'))
const { SceneCharacter } = require(path.join(__dirname, 'models/SceneCharacter'))
const { SceneItem } = require(path.join(__dirname, 'models/SceneItem'))
const { SceneLocation } = require(path.join(__dirname, 'models/SceneLocation'))
const { AuthorPersonalProgress } = require(path.join(__dirname, 'models/AuthorPersonalProgress'))
const { BookChapterHistory } = require(path.join(__dirname, 'models/BookChapterHistory'))
const { BookSceneHistory } = require(path.join(__dirname, 'models/BookSceneHistory'))
const { SoftDeleteQueryBuilder } = require(path.join(__dirname, 'models/SoftDeleteQueryBuilder'))

Model.knex(knexConnection)

module.exports = {
  Author,
  AuthorName,
  User,
  BookGenre,
  Relation,
  Book,
  Item,
  Location,
  Reader,
  BookGenreCollection,
  Chapter,
  ChapterVersion,
  Feedback,
  FeedbackResponse,
  Note,
  Scene,
  Character,
  SceneVersion,
  RelationDetail,
  SceneCharacter,
  SceneItem,
  SceneLocation,
  AuthorPersonalProgress,
  BookChapterHistory,
  BookSceneHistory,
  SoftDeleteQueryBuilder
}
