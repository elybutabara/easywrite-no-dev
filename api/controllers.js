const path = require('path')

const { BookChapterController } = require(path.join(__dirname, 'controller/BookChapterController'))
const { BookChapterVersionController } = require(path.join(__dirname, 'controller/BookChapterVersionController'))
const { BookCharacterController } = require(path.join(__dirname, 'controller/BookCharacterController'))
const { BookLocationController } = require(path.join(__dirname, 'controller/BookLocationController'))
const { BookSceneController } = require(path.join(__dirname, 'controller/BookSceneController'))
const { BookSceneVersionController } = require(path.join(__dirname, 'controller/BookSceneVersionController'))
const { BookSceneItemController } = require(path.join(__dirname, 'controller/BookSceneItemController'))
const { BookSceneLocationController } = require(path.join(__dirname, 'controller/BookSceneLocationController'))
const { BookSceneCharacterController } = require(path.join(__dirname, 'controller/BookSceneCharacterController'))
const { UserController } = require(path.join(__dirname, 'controller/UserController'))
const { BookController } = require(path.join(__dirname, 'controller/BookController'))
const { BookGenreController } = require(path.join(__dirname, 'controller/BookGenreController'))
const { BookGenreCollectionController } = require(path.join(__dirname, 'controller/BookGenreCollectionController'))
const { BookRelationController } = require(path.join(__dirname, 'controller/BookRelationController'))
const { BookRelationDetailController } = require(path.join(__dirname, 'controller/BookRelationDetailController'))
const { BookItemController } = require(path.join(__dirname, 'controller/BookItemController'))

module.exports = {
  BookChapterController,
  BookChapterVersionController,
  BookItemController,
  BookCharacterController,
  BookLocationController,
  BookSceneController,
  BookSceneVersionController,
  BookSceneItemController,
  BookSceneLocationController,
  BookSceneCharacterController,
  UserController,
  BookController,
  BookGenreController,
  BookRelationController,
  BookRelationDetailController,
  BookGenreCollectionController
}
