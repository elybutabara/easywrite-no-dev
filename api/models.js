const path = require('path')

const Knex = require('knex')
const { Model } = require('objection')

const connection = require(path.join(__dirname, 'knexfile'))[process.env.NODE_ENV]
const knexConnection = Knex(connection)
global.knexConnection = knexConnection // to be use in starter.js(main.js) for update versions

const { Author } = require(path.join(__dirname, 'models/Author'))
const { User } = require(path.join(__dirname, 'models/User'))
const { Genre } = require(path.join(__dirname, 'models/Genre'))
const { Relation } = require(path.join(__dirname, 'models/Relation'))
const { Book } = require(path.join(__dirname, 'models/Book'))
const { Chapter } = require(path.join(__dirname, 'models/Chapter'))
const { Scene } = require(path.join(__dirname, 'models/Scene'))
const { Character } = require(path.join(__dirname, 'models/Character'))
const { Item } = require(path.join(__dirname, 'models/Item'))
const { Location } = require(path.join(__dirname, 'models/Location'))
const { GenreCollection } = require(path.join(__dirname, 'models/GenreCollection'))
const { ChapterVersion } = require(path.join(__dirname, 'models/ChapterVersion'))
const { SceneVersion } = require(path.join(__dirname, 'models/SceneVersion'))
const { RelationDetail } = require(path.join(__dirname, 'models/RelationDetail'))
const { SceneCharacter } = require(path.join(__dirname, 'models/SceneCharacter'))
const { SceneItem } = require(path.join(__dirname, 'models/SceneItem'))
const { SceneLocation } = require(path.join(__dirname, 'models/SceneLocation'))
const { SoftDeleteQueryBuilder } = require(path.join(__dirname, 'models/SoftDeleteQueryBuilder'))

Model.knex(knexConnection)

module.exports = {
  Author,
  User,
  Genre,
  Relation,
  Book,
  Item,
  Location,
  GenreCollection,
  Chapter,
  ChapterVersion,
  Scene,
  Character,
  SceneVersion,
  RelationDetail,
  SceneCharacter,
  SceneItem,
  SceneLocation,
  SoftDeleteQueryBuilder
}
