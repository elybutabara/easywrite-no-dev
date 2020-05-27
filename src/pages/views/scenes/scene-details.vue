<template>
<div>
    <div v-if="page.is_ready" class="page-scene-details">
        <div class="es-page-head">
            <div class="inner">
                <div class="details">
                    <div>
                        <h4><strong>{{ properties.scene.title }}</strong></h4>
                    </div>
                </div>
                <div class="actions">
                    <button ref="button" class="es-button-white" :disabled="busy" @click="newVersion()">{{$t('SAVE_AS_NEW_VERSION').toUpperCase()}}</button>
                    <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + properties.scene.uuid, tabComponent: 'scene-form', tabData: { book: book, scene: properties.scene, chapter: chapter }, tabTitle: $t('EDIT')+ ' - ' +  properties.scene.title, newTab: true})">{{$t('EDIT').toUpperCase()}}</button>
                    <button class="es-button-white" @click="deleteScene(properties.scene)">{{$t('DELETE').toUpperCase()}}</button>
                </div>
            </div>
        </div>
        <div v-if="chapter !== null" class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})">{{ $t('CHAPTERS') }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + book.uuid, tabComponent: 'chapter-details', tabData: { book: book, chapter: chapter }, tabTitle: 'VIEW - ' + chapter.title})">{{ chapter.title || 'Untitled' }}</button>
            /
            <button class="current">
                <span>{{ scene.title || 'Untitled' }}</span>
            </button>
        </div>
        <div v-else class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'scene-listing-' + book.uuid, tabComponent: 'scene-listing', tabData: book, tabTitle: $t('OTHER_SCENES') + ' - ' + book.title})">{{ $t('OTHER_SCENES') }}</button>
            /
            <button class="current">
                <span>{{ scene.title || 'Untitled' }}</span>
            </button>
        </div>
        <div class="es-scene-details-tab">
            <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-scene-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'locations' }" @click="changeTab('locations')" class="es-scene-details-tab-item">{{$t('LOCATIONS').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'items' }" @click="changeTab('items')" class="es-scene-details-tab-item">{{$t('ITEMS').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'characters' }" @click="changeTab('characters')" class="es-scene-details-tab-item">{{$t('CHARACTERS').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'versions' }" @click="changeTab('versions')" class="es-scene-details-tab-item">{{$t('VERSIONS').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'compare-versions' }" @click="changeTab('compare-versions')" class="es-scene-details-tab-item">{{$t('COMPARE_VERSIONS').toUpperCase()}}</div>
        </div>
        <div v-if="tab.active === 'content'"  class="es-scene-details-tab-content">
            <div class="export-content"><button class="es-button-white" @click="exportContent()">{{$t('EXPORT_CONTENT')}}</button></div>
            <div v-html="getSceneContent" v-commentbase="commentbase_params" class="description" ></div>
        </div>
        <div v-if="tab.active === 'locations'"  class="es-scene-details-tab-content no-padding">
            <scene-locations :properties="{ book: book, scene: page.data.scene }"></scene-locations>
        </div>
        <div v-if="tab.active === 'items'"  class="es-scene-details-tab-content no-padding">
            <scene-items :properties="{ book: book, scene: page.data.scene }"></scene-items>
        </div>
        <div v-if="tab.active === 'characters'"  class="es-scene-details-tab-content no-padding">
            <scene-characters :properties="{ book: book, scene: page.data.scene }"></scene-characters>
        </div>
        <div v-if="tab.active === 'versions'"  class="es-scene-details-tab-content">
            <scene-versions :properties="{ scene: page.data.scene }"></scene-versions>
        </div>
        <div v-if="tab.active === 'compare-versions'"  class="es-scene-details-tab-content">
            <scene-compare-versions :properties="{ scene: page.data.scene }"></scene-compare-versions>
        </div>
        <b-overlay :show="busy" no-wrap fixed @shown="$refs.dialog.focus()" @hidden="$refs.button.focus()">
            <template v-slot:overlay>
                <div
                    id="overlay-background"
                    ref="dialog"
                    tabindex="-1"
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="form-confirm-label"
                    class="p-3"
                >
                    <b-container class="bv-example-row">
                        <b-card-group deck>
                            <b-card :header="$t('SAVE_AS_NEW_VERSION')"  class="text-center">
                                <b-row style="margin-bottom: 1rem;" class="text-left">
                                    <b-col>
                                        <label>{{$t('DESCRIPTION')}}: </label>
                                        <tiny-editor :initValue="scene_version.change_description"
                                                     v-on:getEditorContent="setDescription"
                                                     class="form-control"
                                        />
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col>
                                        <div class="text-right">
                                            <b-button variant="outline-dark" class="mr-2" @click="busy = !busy">{{$t('CANCEL')}}</b-button>
                                            <b-button variant="dark" @click="saveNewVersion">{{$t('SAVE')}}</b-button>
                                        </div>
                                    </b-col>
                                </b-row>
                            </b-card>
                        </b-card-group>
                    </b-container>
                </div>
            </template>
        </b-overlay>
    </div>
</div>
</template>

<script>
import TinyMCE from '../../../components/TinyMCE'
import SceneLocations from '@/pages/views/scenes/scene-locations'
import SceneItems from '@/pages/views/scenes/scene-items'
import SceneCharacters from '@/pages/views/scenes/scene-characters'
import SceneVersions from '@/pages/views/scenes/scene-versions'
import SceneCompareVersions from '@/pages/views/scenes/scene-compare-versions'

import CommentBase from '../../../components/CommentBase'

const {ipcRenderer} = window.require('electron')

export default {
  name: 'scene-details',
  props: ['properties'],
  directives: {
    commentbase: CommentBase
  },
  data: function () {
    var scope = this
    return {
      scene_version: {
        book_scene_id: null,
        change_description: null,
        content: null
      },
      page: {
        is_ready: false,
        title: '',
        data: null
      },
      tab: {
        active: 'content'
      },
      busy: false,
      tempVersionDesc: '',
      commentbase_params: {
        onMounted: (vm) => {
          scope.commentbase_vm = vm
          vm.setAuthor(this.getAuthor)
          vm.setCommentsJSON(this.comments)
        },
        onAddComment: function () {
          scope.saveComments()
        }
      }
    }
  },
  components: {
    TinyMCE,
    SceneLocations,
    SceneItems,
    SceneCharacters,
    SceneVersions,
    SceneCompareVersions
  },
  computed: {
    book: function () {
      return this.properties.book
    },
    scene: function () {
      return this.properties.scene
    },
    chapter: function () {
      return this.properties.chapter
    },
    getSceneContent: function () {
      var scope = this
      var sceneID = scope.page.data.scene.uuid
      return this.$store.getters.getSceneContent(sceneID)
    },
    comments: function () {
      // return '{}'
      var scope = this
      var sceneID = scope.page.data.scene.uuid
      return this.$store.getters.getSceneComments(sceneID)
    },
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    }
  },
  methods: {
    setDescription (value) {
      var scope = this
      scope.tempVersionDesc = value
    },
    newVersion: function () {
      var scope = this
      this.busy = true

      scope.scene_version.change_description = ''
      if (scope.scene_version.id) {
        delete (scope.scene_version.id)
        delete (scope.scene_version.uuid)
      }
    },
    changeTab: function (tab) {
      var scope = this
      scope.tab.active = tab
    },
    saveNewVersion () {
      var scope = this

      scope.scene_version.change_description = scope.tempVersionDesc
      scope.scene_version.content = scope.getSceneContent
      scope.scene_version.book_scene_id = scope.page.data.scene.uuid

      scope.axios
        .post('http://localhost:3000/scene-versions', scope.scene_version)
        .then(response => {
          if (response.data) {
            // TODO: Insert vuex code that will refresh the chapter version
            scope.tab.active = 'content'
            console.log('RELOAD SCENE VERSIONS')
            console.log(response.data)
            scope.$store.dispatch('loadVersionsByScene', { uuid: response.data.book_scene_id })
            this.busy = false
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('SCENE') + ' ' + this.$t('VERSION') + ' ' + this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.tab.active = 'versions'
            })
          }
        })
    },

    // todo
    saveComments () {
      var scope = this

      var sceneID = scope.page.data.scene.uuid
      scope.scene_version.uuid = this.$store.getters.getSceneVersionUUID(sceneID)
      scope.scene_version.change_description = scope.tempVersionDesc
      scope.scene_version.content = this.commentbase_vm.getContent()
      scope.scene_version.comments = this.commentbase_vm.getCommentsJSON()
      scope.scene_version.book_scene_id = sceneID

      scope.axios
        .post('http://localhost:3000/scene-versions/comment', scope.scene_version)
        .then(response => {
          if (response.data) {
            // TODO: Insert vuex code that will refresh the chapter version
            scope.tab.active = 'content'
            this.busy = false
            // scope.$store.dispatch('updateSceneVersionList', { uuid: response.data.book_scene_id })
          }
        })
    },

    initializeData: function () {
      var scope = this
      scope.page.data = scope.properties

      // load book
      scope.$store.dispatch('loadCharactersByBook', scope.page.data.scene.book_id)
      scope.$store.dispatch('loadItemsByBook', scope.page.data.scene.book_id)
      scope.$store.dispatch('loadLocationsByBook', scope.page.data.scene.book_id)

      // load scene children
      scope.$store.dispatch('loadCharactersByScene', scope.page.data.scene)
      scope.$store.dispatch('loadItemsByScene', scope.page.data.scene)
      scope.$store.dispatch('loadLocationsByScene', scope.page.data.scene)
      scope.$store.dispatch('loadVersionsByScene', scope.page.data.scene)

      setTimeout(function () {
        scope.page.is_ready = true
      }, 500)
    },
    deleteScene: function (scene) {
      var scope = this
      window.swal.fire({
        title: this.$t('ARE_YOU_SURE'),
        text: this.$t('YOU_WONT_BE_ABLE_TO_REVERT_THIS'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: this.$t('YES_DELETE_IT'),
        cancelButtonText: this.$t('CANCEL')
      }).then((result) => {
        if (result.value) {
          scope.axios
            .delete('http://localhost:3000/scenes/' + scene.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeSceneFromList', scene)
                  scope.CHANGE_COMPONENT({tabKey: 'scene-listing-' + scene.book_id, tabComponent: 'scene-listing', tabData: { uuid: scene.book_id }, tabTitle: this.$t('SCENES') + ' - ' + this.$t('LIST'), tabIndex: scope.$store.getters.getActiveTab})
                })
              }
            })
        }
      })
    },
    exportContent: function () {
      var scope = this
      ipcRenderer.send('EXPORT-CONTENT-DOCX', {content: scope.getSceneContent, defaultfilename: scope.properties.scene.title + ' - ' + this.$t('CONTENT')})
    }
  },
  mounted () {
    var scope = this
    scope.initializeData()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .export-content{ text-align: right; margin-bottom: 20px;}
    .es-scene-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
    .es-scene-details-tab .es-scene-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
    .es-scene-details-tab .es-scene-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
    .es-scene-details-tab .es-scene-details-tab-item.active:after { background:#922c39;  }

    .es-scene-details-tab-content { position:relative; padding:30px; background:#fff; height:calc(100vh - 247px); overflow-y:auto; display:block; }
    .es-scene-details-tab-content.no-padding { padding:0px; }
    .es-scene-details-tab-content.active { display:block; }
</style>
