const path = require('path')

const { ChapterController } = require(path.join(__dirname, 'controller/ChapterController'))
const { ItemController } = require(path.join(__dirname, 'controller/ItemController'))
const { CharacterController } = require(path.join(__dirname, 'controller/CharacterController'))
const { LocationController } = require(path.join(__dirname, 'controller/LocationController'))
const { SceneController } = require(path.join(__dirname, 'controller/SceneController'))
const { UserController } = require(path.join(__dirname, 'controller/UserController'))
const { BookController } = require(path.join(__dirname, 'controller/BookController'))

module.exports = {
  ChapterController,
  ItemController,
  CharacterController,
  LocationController,
  SceneController,
  UserController,
  BookController
}
