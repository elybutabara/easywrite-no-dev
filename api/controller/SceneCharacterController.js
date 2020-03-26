'use strict'
const path = require('path')

const { SceneCharacter } = require(path.join(__dirname, '..', 'models'))

class SceneCharacterController {
  static getAllSceneCharactersBySceneId (sceneId) {
    const sceneCharacter = SceneCharacter.query()
      .withGraphFetched('character')
      .where('book_scenes.uuid', sceneId)

    return sceneCharacter
  }

  static async save (data) {
    const save = await SceneCharacter.query().upsertGraph([data])
      .withGraphFetched('scene')
      .withGraphFetched('character')
      .first()

    return save
  }

  static async sync (row) {
    var data = await SceneCharacter.query()
      .patch(row)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await SceneCharacter.query().insert(row)

      // update uuid to match web
      data = await SceneCharacter.query()
        .patch({ 'uuid': row.uuid })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  SceneCharacterController
}
