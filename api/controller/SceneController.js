'use strict'
const path = require('path')
const moment = require('moment')

const { Book, Scene, SceneCharacter, SceneItem, SceneLocation, User } = require(path.join(__dirname, '..', 'models'))

class SceneController {
  static getOtherScene (param) {
    var scenes = Scene.query()
      .where('book_scenes.book_id', param.bookId)
      .withGraphJoined('scene_version', {maxBatchSize: 1})
      .whereNull('book_scenes.deleted_at')
      .whereRaw('chapter_id IS NULL OR chapter_id = 0')
      .orderBy('book_scenes.order')
      .orderBy('book_scenes.created_at')

    return scenes
  }

  static getBookChapterScenes (param) {
    var scenes = Scene.query()
      .where('book_scenes.book_id', param.bookId)
      .withGraphJoined('scene_version', {maxBatchSize: 1})
      .whereNull('book_scenes.deleted_at')
      .whereRaw('chapter_id IS NOT NULL')
      .orderBy('order')

    return scenes
  }

  static async sort (data) {
    var count = 0
    for (let i = 0; i < data.length; i++) {
      var row = data[i]
      // eslint-disable-next-line no-unused-vars
      var item = await Scene.query()
        .patch({ chapter_id: row.chapter_id, order: count })
        .where('uuid', '=', row.uuid)

      count++
    }

    return count
  }

  static async save (data) {
    // Get the max order first before saving to fix scene order error
    if (!data.id) {
      const query = Scene.query()
        .select('order')
        .max('order')
        .where('book_id', data.book_id)
        .whereNull('deleted_at')
      let sceneMaxOrder = null
      if (data.chapter_id != null) {
        query.where('chapter_id', data.chapter_id)
        sceneMaxOrder = await query
      }
      if (sceneMaxOrder) {
        data.order = sceneMaxOrder[0].order + 1
      }
    }

    const upsertGraphOptions = {
      relate: ['scene_version'],
      noDelete: ['scene_version'],
      update: ['scene_version']
    }

    if (data.updated_at) delete data.updated_at
    if (data.scene_version.updated_at) delete data.scene_version.updated_at

    const saveScene = await Scene.query().upsertGraph([data], upsertGraphOptions).first()

    const scene = Scene.query()
      .withGraphJoined('scene_version', {maxBatchSize: 1})
      .orderBy('scene_version.id')
      .findById(saveScene.uuid)

    return scene
  }

  static async saveChildren (sceneId, data) {
    var character_uuids = (Array.isArray(data.charaters)) ? data.charaters : []
    var item_uuids = (Array.isArray(data.items)) ? data.items : []
    var location_uuids = (Array.isArray(data.locations)) ? data.locations : []

    // delete all children if ID is NOT in array
    var delete_scene_characters = await SceneCharacter.query()
      .patch({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString() })
      .where('book_scene_id', '=', sceneId)
      .whereNotIn('book_character_id', character_uuids)

    var delete_scene_items = await SceneItem.query()
      .patch({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString() })
      .where('book_scene_id', '=', sceneId)
      .whereNotIn('book_item_id', item_uuids)

    var delete_scene_locations = await SceneLocation.query()
      .patch({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss').toString() })
      .where('book_scene_id', '=', sceneId)
      .whereNotIn('book_location_id', location_uuids)

    for (let i = 0; i < character_uuids.length; i++) {
      var child_uuid = character_uuids[i]

      var obj = {
        book_scene_id: sceneId,
        book_character_id: child_uuid,
        deleted_at: null
      }

      var row = await SceneCharacter.query()
        .where('book_scene_id', '=', obj.book_scene_id)
        .where('book_character_id', '=', obj.book_character_id)
        .first()

      if (!row) {
        console.log('INSERTED')
        const save = await SceneCharacter.query().upsertGraph([obj]).first()
      } else {
        const save = await SceneCharacter.query()
          .patch(obj)
          .where('book_scene_id', '=', obj.book_scene_id)
          .where('book_character_id', '=', obj.book_character_id)
      }
    }

    for (let i = 0; i < item_uuids.length; i++) {
      var child_uuid = item_uuids[i]

      var obj = {
        book_scene_id: sceneId,
        book_item_id: child_uuid,
        deleted_at: null
      }

      var row = await SceneItem.query()
        .where('book_scene_id', '=', obj.book_scene_id)
        .where('book_item_id', '=', obj.book_item_id)
        .first()

      if (!row) {
        console.log('INSERTED')
        const save = await SceneItem.query().upsertGraph([obj]).first()
      } else {
        const save = await SceneItem.query()
          .patch(obj)
          .where('book_scene_id', '=', obj.book_scene_id)
          .where('book_item_id', '=', obj.book_item_id)
      }
    }

    for (let i = 0; i < location_uuids.length; i++) {
      var child_uuid = location_uuids[i]

      var obj = {
        book_scene_id: sceneId,
        book_location_id: child_uuid,
        deleted_at: null
      }

      var row = await SceneLocation.query()
        .where('book_scene_id', '=', obj.book_scene_id)
        .where('book_location_id', '=', obj.book_location_id)
        .first()

      if (!row) {
        const save = await SceneLocation.query().upsertGraph([obj]).first()
      } else {
        const save = await SceneLocation.query()
          .patch(obj)
          .where('book_scene_id', '=', obj.book_scene_id)
          .where('book_location_id', '=', obj.book_location_id)
      }
    }

    var scene = await Scene.query().where('uuid', '=', sceneId).first()

    var scene_characters = await SceneCharacter.query().withGraphFetched('character').where('book_scene_id', '=', sceneId).whereNull('deleted_at')
    var scene_items = await SceneItem.query().withGraphFetched('item').where('book_scene_id', '=', sceneId).whereNull('deleted_at')
    var scene_locations = await SceneLocation.query().withGraphFetched('location').where('book_scene_id', '=', sceneId).whereNull('deleted_at')

    scene.scene_characters = scene_characters
    scene.scene_items = scene_items
    scene.scene_locations = scene_locations

    return scene
  }

  static async hideStoryline (sceneId, data) {
    var row = await Scene.query()
      .where('id', '=', sceneId).first()

    var scene = await Scene.query()
      .patch({ storyline_hidden: !row.storyline_hidden })
      .where('id', '=', sceneId)

    row.storyline_hidden = !row.storyline_hidden
    return row
  }

  static getAllSceneByChapterId (chapterId) {
    var scenes = Scene.query()
      .withGraphJoined('scene_version', {maxBatchSize: 1})
      .where('book_scenes.chapter_id', chapterId)
      .whereNull('book_scenes.deleted_at')
      .orderBy('order')
      .orderBy('created_at')

    return scenes
  }

  static getAllSceneByChapterIdLatestSceneVersion (chapterId) {
    var scenes = Scene.query()
      .withGraphJoined('scene_version', {maxBatchSize: 1})
      .where('book_scenes.chapter_id', chapterId)
      .whereNull('book_scenes.deleted_at')
      .modifyGraph('scene_version', builder => {
        builder.whereNull('deleted_at')
        builder.orderBy('id', 'DESC')
      })
      .orderBy('order')

    return scenes
  }

  static getSceneById (sceneId) {
    const scene = Scene.query().findById(sceneId)
      .withGraphJoined('scene_version', {maxBatchSize: 1})
      .orderBy('scene_version.id')
      .withGraphJoined('scene_character')
      .orderBy('scene_character.id')

    return scene
  }

  static getSceneByIdWithBookandChapter (sceneId) {
    const scene = Scene.query().findById(sceneId)
      .withGraphJoined('book', {maxBatchSize: 1})
      .withGraphJoined('chapter', {maxBatchSize: 1})
    return scene
  }

  static async delete (sceneId) {
    const scene = await Scene.query().softDeleteById(sceneId)

    return scene
  }

  static async getSyncable (params) {
    var userId = params.query.userID
    var bookUUID = params.query.parent_uuid

    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

      /*
    const books = await Book.query()
      .select('uuid')
      .where('author_id', user.author.uuid)
      // .whereNull('books.deleted_at')
      // .where('books.updated_at', '>', user.synced_at)

    var bookUUIDs = []

    for (let i = 0; i < books.length; i++) {
      bookUUIDs.push(books[i].uuid)
    }
    */

    const rows = await Scene.query()
      .where('book_id', '=', bookUUID)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (datas) {
    var rows = []
    if (!Array.isArray(datas)) rows.push(datas)
    else rows = datas

    for (let i = 0; i < rows.length; i++) {
      var row = rows[i]
      var columns = {
        uuid: row.uuid,
        book_id: row.book_id,
        chapter_id: row.chapter_id,
        title: row.title,
        short_description: row.short_description,
        typeofscene: row.typeofscene,
        importance: row.importance,
        tags: row.tags,
        status: row.status,
        notes: row.notes,
        weather_type: row.weather_type,
        order: row.order,
        date_starts: row.date_starts,
        date_ends: row.date_ends,
        character_id_vp: row.character_id_vp,
        viewpoint_description: row.viewpoint_description,
        storyline_hidden: row.storyline_hidden,
        created_at: row.created_at,
        updated_at: row.updated_at,
        deleted_at: row.deleted_at,
        from_local: row.from_local
      }
      var data = await Scene.query()
        .patch(columns)
        .where('uuid', '=', row.uuid)

      if (!data || data === 0) {
        data = await Scene.query().insert(columns)

        // update uuid to match web
        data = await Scene.query()
          .patch({'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at})
          .where('uuid', '=', data.uuid)
      }
    }

    return true
  }
}

module.exports = {
  SceneController
}
