const path = require('path')

const { GenreController } = require(path.join(__dirname, 'controller/GenreController'))
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
const { GenreCollectionController } = require(path.join(__dirname, 'controller/GenreCollectionController'))
const { RelationDetailController } = require(path.join(__dirname, 'controller/RelationDetailController'))

module.exports = {
  UserController,
  GenreController,
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
  GenreCollectionController
}
