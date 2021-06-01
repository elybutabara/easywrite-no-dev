<template>
<div>
    <div v-if="page.is_ready" class="es-page-main page-scene-details">
        <div class="es-page-head-2 mb-0">
            <div class="row-head">
                <div>
                    <h4 class="main-title"><i class="fas fa-image mr-1"></i> {{ properties.scene.title  || $t('Untitled')}}</h4>
                </div>
                <div class="book-panel-right">
                    <!-- <button ref="button" class="es-button-white" :disabled="busy" @click="newVersion()">{{$t('SAVE_AS_NEW_VERSION').toUpperCase()}}</button>-->
                    <button class="es-button btn-sm white" @click="toggleHiddenScene()">
                      <span v-if="scene_hidden" class="d-flex align-items-center"><i class="las la-eye-slash mr-1"></i> Scene Hidden</span>
                      <span v-else class="d-flex align-items-center"><i class="las la-eye mr-1"></i> {{ $t('HIDE_SCENE') }}</span>
                    </button>
                    <!--<button class="es-button btn-sm white view-comments" v-if="commentbase_dom" @click="toggleComments()">{{('VIEW COMMENTS').toUpperCase()}}</button>-->
                    <button class="es-button icon-only warning" @click="toggleFeedbacks()"><i class="las la-comments"></i><!--{{$t('FEEDBACKS').toUpperCase()}}--></button>
                    <button class="es-button icon-only" @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + properties.scene.uuid, tabComponent: 'scene-form', tabData: { book: book, scene: properties.scene, chapter: chapter }, tabTitle: $t('EDIT')+ ' - ' +  properties.scene.title, newTab: true})"><i class="las la-highlighter"></i><!--{{$t('EDIT').toUpperCase()}}--></button>
                    <button class="es-button icon-only danger" @click="deleteScene(properties.scene)"><i class="las la-trash-alt"></i><!--{{$t('DELETE').toUpperCase()}}--></button>
                </div>
            </div>
        </div>
        <!-- <div v-if="chapter !== null" class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})">{{ $t('CHAPTERS') }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + book.uuid, tabComponent: 'chapter-details', tabData: { book: book, chapter: chapter }, tabTitle: 'VIEW - ' + chapter.title})">{{ chapter.title || 'Untitled' }}</button>
            /
            <button class="current">
                <span>{{ scene.title || 'Untitled' }}</span>
            </button>
        </div> -->
        <div class="es-details-tab-wrapper">
            <div class="es-details-tab">
              <div v-bind:class="{ 'active' : tab.active == 'content' }" v-on:click="changeTab('content')" class="es-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
              <div v-bind:class="{ 'active' : tab.active == 'locations' }" @click="changeTab('locations')" class="es-details-tab-item">{{$t('LOCATIONS').toUpperCase()}}</div>
              <div v-bind:class="{ 'active' : tab.active == 'items' }" @click="changeTab('items')" class="es-details-tab-item">{{$t('ITEMS').toUpperCase()}}</div>
              <div v-bind:class="{ 'active' : tab.active == 'characters' }" @click="changeTab('characters')" class="es-details-tab-item">{{$t('CHARACTERS').toUpperCase()}}</div>
              <div v-bind:class="{ 'active' : tab.active == 'versions' }" @click="changeTab('versions')" class="es-details-tab-item">{{$t('VERSIONS').toUpperCase()}}</div>
              <div v-bind:class="{ 'active' : tab.active == 'compare-versions' }" @click="changeTab('compare-versions')" class="es-details-tab-item">{{$t('COMPARE_VERSIONS').toUpperCase()}}</div>
          </div>
          <div>
              <ul class="es-breadcrumb special mb-0" v-bind:class="{ 'tabs-4' : chapter }">
                <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);" style="max-width: 120px; text-overflow: ellipses; white-space: nowrap;"><span>{{ book.title }}</span></a></li>
                <li v-if="chapter"><a @click="CHANGE_COMPONENT({tabKey: 'scene-listing-' + book.uuid, tabComponent: 'chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})" href="javascript:void(0);"><span>{{ $t('CHAPTERS') }}</span></a></li>
                <li v-if="chapter"><a @click="CHANGE_COMPONENT({tabKey: 'scene-listing-' + book.uuid, tabComponent: 'chapter-details', tabData: { book: book, chapter: chapter }, tabTitle: chapter.title + ' - ' + book.title})" href="javascript:void(0);"><span>{{ chapter.title }}</span></a></li>
                <li v-else><a @click="CHANGE_COMPONENT({tabKey: 'scene-listing-' + book.uuid, tabComponent: 'scene-listing', tabData: book, tabTitle: $t('OTHER_SCENES') + ' - ' + book.title})" href="javascript:void(0);"><span>{{ $t('OTHER_SCENES') }}</span></a></li>
                <li><a href="javascript:void(0);" style="padding-right: 20px;"><span>{{ scene.title || 'Untitled' }}</span></a></li>
              </ul>
          </div>
        </div>
        <div style="position:relative;">
            <!--<CommentBasePanelv2 v-bind:class="{ 'show_comments' : show_comments }" v-if="commentbase_dom" :dom="commentbase_dom" :properties="{ book: book,
            parent_name: 'scene', parent_id: scene.uuid, parent: scene, selected_comment: selected_comment }" ref="commentbasepanelv2"></CommentBasePanelv2>-->
        <Feedback v-bind:class="{ 'show_feedbacks' : show_feedbacks }" :properties="{ book: book, parent: scene, parent_name: 'scene', toggleType: true }"></Feedback>

        <!-- footer previous & next -->
        <div style="border-top:1px solid #ccc; z-index:2000; background:#fff; height:50px; padding:0px 20px; line-height:50px; width:100%; position:absolute; bottom:0px; left:0px;">
            <button v-if="prevScene != null && prevType == 'scene'" @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + prevScene.id, tabComponent: 'scene-details',  tabData: { book: book, scene: prevScene, chapter: chapter }, tabTitle: prevScene.title})" style="float:left; background:transparent; border:none;">
                <i class="las la-angle-double-left"></i> {{ $t('PREV') }}
            </button>
            <button v-if="nextScene != null && nextType == 'scene'" @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + nextScene.id, tabComponent: 'scene-details',  tabData: { book: book, scene: nextScene, chapter: chapter}, tabTitle: nextScene.title})" style="float:right; background:transparent; border:none;">
                {{ $t('NEXT') }} <i class="las la-angle-double-right"></i>
            </button>

            <button v-if="prevScene != null && prevType == 'chapter'" @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + prevScene.id, tabComponent: 'chapter-details',  tabData: { book: book, chapter: prevScene }, tabTitle: 'VIEW' + ' - ' + prevScene.title})" style="float:left; background:transparent; border:none;">
                <i class="las la-angle-double-left"></i> {{ $t('PREV') }}
            </button>
            <button v-if="nextScene != null && nextType == 'chapter'" @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + nextScene.id, tabComponent: 'chapter-details',  tabData: { book: book, chapter: nextScene }, tabTitle: 'VIEW' + ' - ' + nextScene.title})" style="float:right; background:transparent; border:none;">
                {{ $t('NEXT') }} <i class="las la-angle-double-right"></i>
            </button>
        </div>

        <div v-if="tab.active === 'content'"  class="es-scene-details-tab-content">
            <div class="export-content">
              <b-button class="es-button btn-sm white" :disabled="exportOnProgress"  @click="exportContent()">
                <div v-if="exportOnProgress === false"><span>{{$t('EXPORT_CONTENT')}}</span></div>
                <div v-else>
                  <b-spinner small type="grow"></b-spinner>
                  <span>{{exportLoading}}</span>
                </div>
              </b-button>
            </div>
            <div v-html="scene.content" class="description" v-bind:id="commentbase_id"></div>
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
import Feedback from '../../../components/Feedback'
import TinyMCE from '../../../components/TinyMCE'
import SceneLocations from '@/pages/views/scenes/scene-locations'
import SceneItems from '@/pages/views/scenes/scene-items'
import SceneCharacters from '@/pages/views/scenes/scene-characters'
import SceneVersions from '@/pages/views/scenes/scene-versions'
import SceneCompareVersions from '@/pages/views/scenes/scene-compare-versions'
import Vue from 'vue'
import CommentBasePanelv2 from '../../../components/CommentBasePanelv2'
// import CommentBasePanel from '../../../components/CommentBasePanel'

const {ipcRenderer} = window.require('electron')

export default {
  name: 'scene-details',
  props: ['properties'],
  data: function () {
    // eslint-disable-next-line no-unused-vars
    var scope = this
    return {
      scene_hidden: false,
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
      commentbase_id: ('cm-' + Math.random()).replace('.', ''),
      commentbase_dom: null,
      // commentbase_params: {
      //   onMounted: (vm) => {
      //     scope.commentbase_vm = vm
      //     vm.setAuthor(this.getAuthor)
      //     vm.setCommentsJSON(this.comments)
      //   },
      //   onAddComment: function () {
      //     scope.saveComments()
      //   }
      // },
      exportOnProgress: false,
      exportLoading: this.$t('Loading'),
      show_feedbacks: false,
        show_comments: false,
        selected_comment: null,
      nextType: '',
      prevType: ''
    }
  },
  components: {
    Feedback,
    TinyMCE,
    SceneLocations,
    SceneItems,
    SceneCharacters,
    SceneVersions,
    SceneCompareVersions,
      CommentBasePanelv2
    // CommentBasePanel
  },
  computed: {
    book: function () {
      return this.properties.book
    },
    scene: function () {
      return this.$store.getters.findScene(this.properties.scene)
    },
    chapter: function () {
      if (this.properties.chapter) { return this.$store.getters.findChapter(this.properties.chapter) }
      return null
    },
    // getSceneContent: function () {
    //   var scope = this
    //   var sceneID = scope.page.data.scene.uuid
    //   return this.$store.getters.getSceneContent(sceneID)
    // },
    // comments: function () {
    //   // return '{}'
    //   var scope = this
    //   var sceneID = scope.page.data.scene.uuid
    //   return this.$store.getters.getSceneComments(sceneID)
    // },
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    },
    prevScene: function () {
      let scene = this.scene
      let scope = this
      let previousScene = this.$store.getters.getPrevScene(scene)

      if (previousScene != null) { // if there is previous scene, then return previous scene
        scope.prevType = 'scene'
        return previousScene
      } else { // if not previous scene. return the chapter of the scene
        scope.prevType = 'chapter'
        return scope.chapter
      }
    },
    nextScene: function () {
      let scope = this
      let scene = this.scene
      let chapter = this.chapter

      // this is for other scene, since other scne dont have chapter
      if (!chapter) return null

      let nextScene = this.$store.getters.getNextScene(chapter, scene)
      // check if there is a next scene
      if (nextScene != null) {
        scope.nextType = 'scene'
        return nextScene
      } else { // if no next scene, then proceed to next chapter
        scope.nextType = 'chapter'
        return this.$store.getters.getNextChapter(chapter)
      }
    }
  },
  methods: {
    toggleHiddenScene: function () {
      var scope = this
      scope.axios
        .post('http://localhost:3000/scenes/hide', { hidden : !scope.scene_hidden, id: scope.scene.id, uuid: scope.scene.uuid })
        .then(response => {
          if (response.status == 200) {
            console.log('toggleHiddenChapter res', response)
            scope.$store.dispatch('updateSceneHidden', response.data)
            scope.$store.dispatch('loadScenesByChapter', scope.chapter.uuid)
            scope.scene_hidden = !scope.scene_hidden

            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Changes ' + scope.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            })
          }

        }
      );
    },
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
      Vue.nextTick(function () {
          if (tab === 'content') {
            scope.commentbase_dom = document.getElementById(scope.commentbase_id)
          } else {
            scope.commentbase_dom = null
          }
      })
    },
    saveNewVersion () {
      var scope = this

      scope.scene_version.change_description = scope.tempVersionDesc
      scope.scene_version.content = scope.scene.content
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
    // saveComments () {
    //   var scope = this
    //
    //   var sceneID = scope.page.data.scene.uuid
    //   scope.scene_version.uuid = this.$store.getters.getSceneVersionUUID(sceneID)
    //   scope.scene_version.change_description = scope.tempVersionDesc
    //   scope.scene_version.content = this.commentbase_vm.dom.innerHTML
    //   scope.scene_version.comments = this.commentbase_vm.getCommentsJSON()
    //   scope.scene_version.book_scene_id = sceneID
    //   scope.scene_version.new_comment_json = this.commentbase_vm.getLastComment()
    //   scope.scene_version.new_comment_json.scene_id = sceneID
    //   scope.scene_version.new_comment_json.scene_title = scope.page.data.scene.title
    //   scope.scene_version.new_comment_json = JSON.stringify(scope.scene_version.new_comment_json)
    //
    //   scope.axios
    //     .post('http://localhost:3000/scene-versions/comment', scope.scene_version)
    //     .then(response => {
    //       if (response.data) {
    //         // TODO: Insert vuex code that will refresh the chapter version
    //         scope.tab.active = 'content'
    //         this.busy = false
    //         // scope.$store.dispatch('updateSceneVersionList', { uuid: response.data.book_scene_id })
    //       }
    //     })
    // },
    initializeData: async function () {
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

        try {
            await scope.$store.dispatch('loadCommentsByScene', scope.properties.scene.uuid)
        } catch (ex) {
            console.log('Failed to load data')
        } finally {
            setTimeout(function () {
                scope.page.is_ready = true
                scope.changeTab('content')
            }, 500)
        }
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
                  if (scope.chapter) {
                    scope.CHANGE_COMPONENT({tabKey: 'scene-listing-' + scope.book.uuid, tabComponent: 'chapter-details', tabData: { book: scope.book, chapter: scope.chapter }, tabTitle: scope.chapter.title + ' - ' + scope.book.title})
                  } else {
                    scope.CHANGE_COMPONENT({tabKey: 'scene-listing-' + scope.book.uuid, tabComponent: 'scene-listing', tabData: scope.book, tabTitle: scope.$t('OTHER_SCENES') + ' - ' + scope.book.title})
                  }
                })
              }
            })
        }
      })
    },
    exportContent: function () {
      var scope = this
      scope.exportOnProgress = true
      ipcRenderer.send('EXPORT-CONTENT-DOCX', {content: scope.scene.content, defaultfilename: scope.properties.scene.title + ' - ' + this.$t('CONTENT')})
    },
    toggleFeedbacks: function () {
      let scope = this
      scope.show_feedbacks = !scope.show_feedbacks
    },
      toggleComments: function () {
          let scope = this
          if (scope.show_feedbacks) {
              scope.show_feedbacks = !scope.show_feedbacks
          }

          if (scope.show_comments) {
              document.getElementById('app-container').focus()
          }

          this.$refs.commentbasepanelv2.sub_comment_msg = '';
          this.$refs.commentbasepanelv2.main_comment_id = null;
          // close all sub_comments
          $.each(this.$refs.commentbasepanelv2.comments, function(k, v) {
              v.show_sub_comments = false;
          });

          scope.show_comments = !scope.show_comments
      },
  },
  mounted () {
    var scope = this

    if (scope.scene.hidden) {
      scope.scene_hidden = true
    }
    console.log(scope.scene_hidden, 'mounted hidden')

    if (scope.properties.openfeedback) {
      scope.show_feedbacks = true
    }

    scope.initializeData()
    ipcRenderer.on('EXPORT_DOCX_ENABLE_BUTTON', function () {
      scope.exportOnProgress = false
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .las.la-eye,
    .las.la-eye-slash { font-size: 16px; }

    .es-breadcrumb.special{ max-width: none !important;}
    .export-content{ text-align: right; margin-bottom: 20px;}
    .es-scene-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
    .es-scene-details-tab .es-scene-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
    .es-scene-details-tab .es-scene-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
    .es-scene-details-tab .es-scene-details-tab-item.active:after { background:#922c39;  }

    .es-scene-details-tab-content { position:relative; padding:30px; background:#fff; height: calc(107vh - 319px); overflow-y:auto; display:block; }
    .es-scene-details-tab-content.no-padding { padding:0px; }
    .es-scene-details-tab-content.active { display:block; }
    @media screen and (max-width: 1334px){
        div.es-details-tab-wrapper{
            display: block;
        }
        div.es-details-tab-wrapper > div:nth-child(2){
            padding: 15px 0px;
        }
        .es-breadcrumb.special.tabs-4 li a span {
            max-width: 180px;
        }
    }
</style>
