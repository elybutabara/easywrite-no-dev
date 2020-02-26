const path = require('path');
let Knex = require('knex');
const { Model } = require('objection')
//
// let dblocation
//
// if (process.env.NODE_ENV === 'production' && process.platform === 'darwin') {
//   /*
//   * Content/Resources/app folder inside .app
//   * global.resourcePath : folder where the main.js reside , [Content/Resources/app/app]
//   * */
//   global.resourcePath = process.resourcesPath
//   dblocation = path.join(process.resourcesPath, 'db', 'base.db')
// } else if (process.env.NODE_ENV === 'production' && process.platform === 'win32') {
//   /*
//   * process.resourcesPath : the .asar file [read only]
//   * global.resourcePath : resource folder where the extra folders that may modified are place , e.g : "public/images" , "database.db"
//   * */
//
//   global.resourcePath = process.resourcesPath
//   dblocation = path.join(process.resourcesPath, '/db/base.db')
// } else {
//   /*
//   * Directory path
//   * */
//   global.resourcePath = path.resolve(__dirname, '../resources')
//   dblocation = path.join(global.resourcePath, 'db/base.db')
// }
//
// dblocation = (process.env.NODE_ENV === 'dev') ? path.join(global.resourcePath, 'db/base.db') : path.join(process.resourcesPath, 'db', 'base.db')

global.resourcePath = (process.env.NODE_ENV === 'dev') ? path.resolve(__dirname, '../resources') : process.resourcesPath

var knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: path.join(global.resourcePath, 'db', 'base.db')
  }
})

Model.knex(knex);

const { Author } = require(path.join(__dirname, 'models/Author'));
const { User } = require(path.join(__dirname, 'models/User'));
const { Book } = require(path.join(__dirname, 'models/Book'));
const { Chapter } = require(path.join(__dirname, 'models/Chapter'));
const { Scene } = require(path.join(__dirname, 'models/Scene'));
const { Character } = require(path.join(__dirname, 'models/Character'));
const { Item } = require(path.join(__dirname, 'models/Item'));
const { Location } = require(path.join(__dirname, 'models/Location'));
const { BookGenre } = require(path.join(__dirname, 'models/BookGenre'));
const { BookGenreCollection } = require(path.join(__dirname, 'models/BookGenreCollection'));
const { ChapterVersion } = require(path.join(__dirname, 'models/ChapterVersion'));
const { SceneVersion } = require(path.join(__dirname, 'models/SceneVersion'));
const { Relation } = require(path.join(__dirname, 'models/Relation'));
const { SceneCharacter } = require(path.join(__dirname, 'models/SceneCharacter'));
const { SceneItem } = require(path.join(__dirname, 'models/SceneItem'));
const { SceneLocation } = require(path.join(__dirname, 'models/SceneLocation'));
const { RelationDetail } = require(path.join(__dirname, 'models/RelationDetail'));
const { SoftDeleteQueryBuilder } = require(path.join(__dirname, 'models/SoftDeleteQueryBuilder'));

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
