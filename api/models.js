const path = require('path')

const Knex = require('knex')
const { Model } = require('objection')

const connection = require(path.join('../src/knexfile'))[process.env.NODE_ENV]
const knexConnection = Knex(connection)

const { Author } = require(path.join(__dirname, 'models/Author'))
const { User } = require(path.join(__dirname, 'models/User'))
const { Book } = require(path.join(__dirname, 'models/Book'))
const { Chapter } = require(path.join(__dirname, 'models/Chapter'))
const { Scene } = require(path.join(__dirname, 'models/Scene'))
const { Character } = require(path.join(__dirname, 'models/Character'))
const { Item } = require(path.join(__dirname, 'models/Item'))
const { Location } = require(path.join(__dirname, 'models/Location'))
const { BookGenre } = require(path.join(__dirname, 'models/BookGenre'))
const { BookGenreCollection } = require(path.join(__dirname, 'models/BookGenreCollection'))
const { ChapterVersion } = require(path.join(__dirname, 'models/ChapterVersion'))
const { SceneVersion } = require(path.join(__dirname, 'models/SceneVersion'))
const { Relation } = require(path.join(__dirname, 'models/Relation'))
const { SceneCharacter } = require(path.join(__dirname, 'models/SceneCharacter'))
const { SceneItem } = require(path.join(__dirname, 'models/SceneItem'))
const { SceneLocation } = require(path.join(__dirname, 'models/SceneLocation'))
const { RelationDetail } = require(path.join(__dirname, 'models/RelationDetail'))
const { SoftDeleteQueryBuilder } = require(path.join(__dirname, 'models/SoftDeleteQueryBuilder'))

Model.knex(knexConnection)

module.exports = {
  Author,
  User,
  Book,
  Chapter,
  Scene,
  Character,
  Item,
  Location,
  BookGenre,
  BookGenreCollection,
  ChapterVersion,
  SceneVersion,
  Relation,
  RelationDetail,
  SceneCharacter,
  SceneItem,
  SceneLocation,
  SoftDeleteQueryBuilder
}
