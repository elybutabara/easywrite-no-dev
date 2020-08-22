'use strict'

const path = require('path')

const { BaseModel } = require('./BaseModel')

class Webinar extends BaseModel {
  // Table name is the only required property.
  static get tableName () {
    return 'webinars'
  }

  static relationMappings = {
    webinar_presenters: {
      relation: BaseModel.HasManyRelation,
      modelClass: path.join(__dirname, 'WebinarPresenter'),
      join: {
        from: 'webinars.id',
        to: 'webinar_presenters.webinar_id'
      },
      softDelete: true
    }
  }
}

module.exports = {
  Webinar
}
