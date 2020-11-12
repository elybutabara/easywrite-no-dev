'use strict'
const path = require('path')
// const moment = require('moment')
// const { raw } = require('objection')

const { AppSetting } = require(path.join(__dirname, '..', 'models'))

class AppSettingsController {
  static async getAppSettings (data) {
    // , raw('( SELECT assignment_manuscripts.* FROM assignment_manuscripts WHERE assignment_manuscripts.assignment_id = assignments.uuid )').as('assignment_manuscripts')
    const queryBuilder = AppSetting.query()
      .select('*')
      .join('user', 'app_settings.user_id', 'users.uuid')
      .where('courses_taken.user_id', data.userId)

    let settings = await queryBuilder.orderBy('assignments.created_at', 'DESC')

    return settings
  }

  static async save (data) {
    let model = await AppSetting.query()
      .patch(data)
      .where('user_id', '=', data.user_id)

    if (!model || model === 0) {
      model = await AppSetting.query().insert(data)
    }

    return model
  }
}

module.exports = {
  AppSettingsController
}
