'use strict'
const path = require('path')
// const moment = require('moment')
// const { raw } = require('objection')
const { app } = require('electron')
const {  User, AppSetting } = require(path.join(__dirname, '..', 'models'))

class AppSettingsController {
  static async getAppSettings (userId) {
    const model = AppSetting.query()
      .withGraphJoined('user')
      .where('user_id', userId)

    let settings = await model.orderBy('app_version', 'DESC').first()

    return settings
  }

  static async save (data) {
    let model = await AppSetting.query()
      .patch(data)
      .where('user_id', data.user_id)
      .where('app_version', data.app_version)

    if (!model || model === 0) {
      data.run_count = 0
      model = await AppSetting.query().insert(data)
    }

    if (model.run_count < 1) {
      // this will update user synced_at so that it will upload all data app to web
      await User.query()
        .patch({synced_at: '1970-01-01 00:00:01'})
        .where('uuid', '=', data.user_id)
    }

    return model
  }

  static async increaseCounter (userId) {
    // update counter
    await AppSetting.query()
      .increment('run_count', 1)
      .where('user_id', userId)
      .where('app_version', app.getVersion())
  }
}

module.exports = {
  AppSettingsController
}
