<template>
<div>
    <div v-if="page.is_ready" class="page-scene-characters fadeIn animated">
        <div class="es-scene-children-wrapper" style="">
            <button @click="showChildrenItemList()" class="btn-dark" style="float:right;">ADD SCENE CHARACTER</button>
            <div class="heading">CHARACTERS</div>
            <div class="es-row">
                <div class="es-col fadeIn animated" v-for="scene_character in GET_SCENE_CHARACTERS_BY_SCENE(scene.uuid)" v-bind:key="scene_character.id">
                    <div class="es-card">
                        <div class="es-card-content">
                            <p class="title">{{ scene_character.character.fullname || 'Untitled' }}</p>
                            <i class="description" v-if="scene_character.character.description !== '' && scene_character.character.description !== null" v-html="scene_character.character.description"></i>
                            <i class="description" v-else>No Description</i>
                        </div>
                        <div class="es-card-footer">
                            <button class="btn-" @click="CHANGE_COMPONENT('character-details', {  book_id: scene.book_id, character: scene_character.character }, scene_character.character.fullname)"><i class="lar la-eye"></i> VIEW</button>
                            <button class="btn-" @click="CHANGE_COMPONENT('character-form', { book_id: scene.book_id, character: character }, 'Edit - ' + scene_character.character.fullname, true)"><i class="las la-pencil-alt"></i> EDIT</button>
                            <button class="btn-delete" @click="DELETE_FROM_LIST('scene-characters', scene_character)"><i class="las la-trash-alt"></i> DELETE</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="adding" class="scene-children-items slideInRight animated">
                <div class="note">
                    <i @click="hideChildrenItemList()" class="closer fas fa-times"></i>
                    Double click the selected character to add to the scene
                </div>
                <div class="scene-children-items-list" >
                    <div v-bind:key="character.id" v-for="character in GET_CHARACTERS_BY_BOOK(scene.book_id)">
                        <div class="scene-children-item" @dblclick="save(character)" v-if="!isIncluded(character)">{{ character.fullname }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import TinyMCE from '../../components/TinyMCE'
export default {
  name: 'scene-characters',
  props: ['properties'],
  data: function () {
    return {
      page: {
        title: '',
        is_ready: false,
        data: null
      },
      adding: false
    }
  },
  components: {
    TinyMCE
  },
  computed: {
  },
  methods: {
    isIncluded: function (character) {
      var scope = this
      var scenes = scope.GET_SCENE_CHARACTERS_BY_SCENE(scope.scene.uuid)
      for (let i = 0; i < scenes.length; i++) {
        let scene = scenes[i]
        if (scene.character.uuid === character.uuid) {
          return true
        }
      }
      return false
    },
    showChildrenItemList: function () {
      var scope = this
      scope.adding = true
    },
    hideChildrenItemList: function () {
      var scope = this
      scope.adding = false
    },
    save (character) {
      var scope = this

      var sceneCharacter = {
        book_scene_id: scope.scene.uuid,
        book_character_id: character.uuid
      }

      scope.axios
        .post('http://localhost:3000/scene-characters', sceneCharacter)
        .then(response => {
          if (response.data) {
            scope.ADD_TO_LIST('scene-characters', response.data)
          }
        })
    }
  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this
    scope.scene = scope.properties.scene
    scope.LOAD_LIST('characters', { uuid: scope.scene.book_id })
    setTimeout(function () {
      scope.page.is_ready = true
    }, 500)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .es-scene-children-wrapper { padding:20px; height:calc(100vh - 250px); position:relative; overflow-x:hidden; }
    .es-scene-children-wrapper .heading { padding:10px; font-size:20px; }
    .es-scene-children-wrapper .scene-children-items {  position:absolute; top:0px; right:0px; width:280px; height:100%; background:#f5f8fa; border-left:1px solid #e0e5ee; }
    .es-scene-children-wrapper .scene-children-items .note { position:relative; background:#fff; padding:10px; padding-right:15px; border-bottom:1px solid #e0e5ee; font-style:italic; }
    .es-scene-children-wrapper .scene-children-items .closer { position:absolute; cursor:pointer; top:10px; right:5px; }
    .es-scene-children-wrapper .scene-children-items .scene-children-items-list { height:calc(100vh - 315px); overflow-y:auto; }
    .es-scene-children-wrapper .scene-children-items .scene-children-items-list .scene-children-item { cursor:pointer; background:#fff; border-bottom:1px solid #e0e5ee; padding:10px;  }

    .es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
    .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
    .es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; }
    .es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

    .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }

    .es-card .es-card-footer { position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 0px; border-top:1px solid #e0e5ee; }
    .es-card .es-card-footer button { font-weight:600; background:transparent; border:none; height:40px; line-height:32px; text-align:center; font-size:14px; padding:0px 8px; }
    .es-card .es-card-footer button:hover { background:#e0e5ee; }
    .es-card .es-card-footer button i { font-size:18px; }
    .es-card .es-card-footer button.btn-delete { font-weight:600; color:#8f2c39; border-left:1px solid #e0e5ee; position:absolute; top:0px; right:0px; }

    .btn-dark { margin-top:5px; background:#324553; color:#fff; border:none; border-radius:3px; height:35px; line-height:35px; padding:0px 10px; }
</style>
