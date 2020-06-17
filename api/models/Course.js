'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Course extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'courses'
  }

  static relationMappings = {}
}

module.exports = {
  Course
}
