const path = require('path')

const { BookGenreController } = require(path.join(__dirname, 'controller/BookGenreController'))
const { RelationController } = require(path.join(__dirname, 'controller/RelationController'))
const { ItemController } = require(path.join(__dirname, 'controller/ItemController'))
const { ChapterController } = require(path.join(__dirname, 'controller/ChapterController'))
const { ChapterVersionController } = require(path.join(__dirname, 'controller/ChapterVersionController'))
const { FeedbackController } = require(path.join(__dirname, 'controller/FeedbackController'))
const { FeedbackResponseController } = require(path.join(__dirname, 'controller/FeedbackResponseController'))
const { CharacterController } = require(path.join(__dirname, 'controller/CharacterController'))
const { LocationController } = require(path.join(__dirname, 'controller/LocationController'))
const { ReaderController } = require(path.join(__dirname, 'controller/ReaderController'))
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
const { BookChapterHistoryController } = require(path.join(__dirname, 'controller/BookChapterHistoryController'))
const { BookSceneHistoryController } = require(path.join(__dirname, 'controller/BookSceneHistoryController'))

module.exports = {
  UserController,
  BookGenreController,
  RelationController,
  BookController,
  ItemController,
  LocationController,
  ReaderController,
  ChapterController,
  ChapterVersionController,
  FeedbackController,
  FeedbackResponseController,
  CharacterController,
  SceneController,
  SceneVersionController,
  SceneItemController,
  SceneLocationController,
  SceneCharacterController,
  RelationDetailController,
  BookGenreCollectionController,
  AuthorPersonalProgressController,
  BookChapterHistoryController,
  BookSceneHistoryController
}
