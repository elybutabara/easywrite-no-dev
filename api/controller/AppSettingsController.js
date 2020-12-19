'use strict'
const path = require('path')
// const moment = require('moment')
// const { raw } = require('objection')
const { app } = require('electron')
const { User, AppSetting, Scene } = require(path.join(__dirname, '..', 'models'))

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

    /*
      * this is fixed fix for specific version
      * */
    const v = data.app_version.split('-')
    if (v[0] <= '0.1.31' && v[0] >= '0.1.29') {
      /*
      * get the scenes with order greater than 10
      * this mean we include the possible 'order' greater than 20 scenes within a chapter
      * for accuracy
      * */
      const scenelist = await Scene.query()
        .select('chapter_id')
        .where('order', '>', 20)
        .groupBy('chapter_id')

      for (const item of scenelist) {
        const scenes = await Scene.query()
          .where('chapter_id', item.chapter_id)
          .orderBy('order', 'asc')

        for (const scene of scenes) {
          let nextScene
          if (scenes.indexOf(scene) + 1 <= scenes.length) {
            nextScene = scenes[scenes.indexOf(scene) + 1]
          }

          if (nextScene) {
            // skip null and if next 'order' is correct
            if (scene.order == null || scene.order == (nextScene.order - 1)) {
              continue
            } else {
              // change the 'order' by incrementing the 'order' of the previous correct row
              scenes[scenes.indexOf(scene) + 1].order = scene.order + 1
              // update model
              await Scene.query()
                .patch({'order': scene.order + 1})
                .where('uuid', '=', nextScene.uuid)
            }
          }
        }
      } // endforeach
    }
    /*
    *
    * */

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
