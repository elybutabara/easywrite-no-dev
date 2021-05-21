'use strict'

const { BaseModel } = require('./BaseModel')

class AdminTreadline extends BaseModel {
    // Table name is the only required property.
    static get tableName () {
      return 'admin_treadline'
    }
  
    static get idColumn () { return ['uuid'] }
  
}
  
module.exports = {
    AdminTreadline
}