const path = require('path')

const { BookGenreController } = require(path.join(__dirname, 'controller/BookGenreController'))
const { RelationController } = require(path.join(__dirname, 'controller/RelationController'))
const { ItemController } = require(path.join(__dirname, 'controller/ItemController'))
const { ChapterController } = require(path.join(__dirname, 'controller/ChapterController'))
const { ChapterVersionController } = require(path.join(__dirname, 'controller/ChapterVersionController'))
const { CharacterController } = require(path.join(__dirname, 'controller/CharacterController'))
const { LocationController } = require(path.join(__dirname, 'controller/LocationController'))
const { SceneController } = require(path.join(__dirname, 'controller/SceneController'))
const { SceneVersionController } = require(path.join(__dirname, 'controller/SceneVersionController'))
const { SceneItemController } = require(path.join(__dirname, 'controller/SceneItemController'))
const { SceneLocationController } = require(path.join(__dirname, 'controller/SceneLocationController'))
const { SceneCharacterController } = require(path.join(__dirname, 'controller/SceneCharacterController'))
const { UserController } = require(path.join(__dirname, 'controller/UserController'))
const { BookController } = require(path.join(__dirname, 'controller/BookController'))
const { BookGenreCollectionController } = require(path.join(__dirname, 'controller/BookGenreCollectionController'))
const { RelationDetailController } = require(path.join(__dirname, 'controller/RelationDetailController'))
const { AuthorPersonalProgressController } = require(path.join(__dirname, 'controller/AuthorPersonalProgressController'))

module.exports = {
  UserController,
  BookGenreController,
  RelationController,
  BookController,
  ItemController,
  LocationController,
  ChapterController,
  ChapterVersionController,
  CharacterController,
  SceneController,
  SceneVersionController,
  SceneItemController,
  SceneLocationController,
  SceneCharacterController,
  RelationDetailController,
  BookGenreCollectionController,
  AuthorPersonalProgressController
}
