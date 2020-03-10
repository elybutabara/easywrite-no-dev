const { Model } = require('objection')
const moment = require('moment')

class BaseModel extends Model {
  $beforeInsert (queryContext) {
    this.created_at = moment().format('YYYY-MM-DD hh:mm:ss').toString()
    this.updated_at = moment().format('YYYY-MM-DD hh:mm:ss').toString()
  }

  $beforeUpdate (opt, queryContext) {
    this.updated_at = moment().format('YYYY-MM-DD hh:mm:ss').toString()
  }
}

module.exports = {
  BaseModel
}
