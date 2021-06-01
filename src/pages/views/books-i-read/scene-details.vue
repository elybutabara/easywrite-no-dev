<template>
<div>
    <div v-if="page.is_ready" class="page-scene-details">
        <div class="es-page-head-2 mb-0">
            <div class="row-head">
                <div>
                    <div>
                        <h4><strong>{{ properties.scene.title }}</strong></h4>
                    </div>
                </div>
                <div class="book-panel-right">
                    <!--<button class="es-button btn-sm white view-comments" v-if="commentbase_dom" @click="toggleComments()">{{('VIEW COMMENTS').toUpperCase()}}</button>-->
                  <button class="es-button btn-sm white" @click="toggleFeedbacks()">{{$t('FEEDBACKS').toUpperCase()}}</button>
                  <button class="es-button btn-sm white" @click="toggleNotes()">{{$t('MY NOTES').toUpperCase()}}</button>
                </div>
            </div>
        </div>
        <!-- <div v-if="chapter !== null" class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'books-i-read-chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})">{{ $t('CHAPTERS') }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + book.uuid, tabComponent: 'books-i-read-chapter-details', tabData: { book: book, chapter: chapter }, tabTitle: 'VIEW - ' + chapter.title})">{{ chapter.title || 'Untitled' }}</button>
            /
            <button class="current">
                <span>{{ scene.title || 'Untitled' }}</span>
            </button>
        </div> -->

        <!-- <div v-else class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'scene-listing-' + book.uuid, tabComponent: 'books-i-read-scene-listing', tabData: book, tabTitle: $t('OTHER_SCENES') + ' - ' + book.title})">{{ $t('OTHER_SCENES') }}</button>
            /
            <button class="current">
                <span>{{ scene.title || 'Untitled' }}</span>
            </button>
        </div> -->
        <div class="es-details-tab-wrapper">
            <div class="es-details-tab">
                <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
            </div>
            <div>
            <ul v-if="chapter !== null" class="es-breadcrumb special mb-0">
                <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);"><span>{{ book.title }}</span></a></li>
                <li><a @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'books-i-read-chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})" href="javascript:void(0);"><span>{{ $t('CHAPTERS') }}</span></a></li>
                <li><a @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + book.uuid, tabComponent: 'books-i-read-chapter-details', tabData: { book: book, chapter: chapter }, tabTitle: 'VIEW - ' + chapter.title})" href="javascript:void(0);"><span>{{ chapter.title || 'Untitled' }}</span></a></li>
                <li><a href="javascript:void(0);" style="padding-right: 20px;">
                    <span>{{ scene.title || 'Untitled' }}</span>
                </a></li>
            </ul>

            <ul v-else class="es-breadcrumb special mb-0">
                <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);"><span>{{ book.title }}</span></a></li>
                <li><a @click="CHANGE_COMPONENT({tabKey: 'scene-listing-' + book.uuid, tabComponent: 'books-i-read-scene-listing', tabData: book, tabTitle: $t('OTHER_SCENES') + ' - ' + book.title})" href="javascript:void(0);"><span>{{ $t('OTHER_SCENES') }}</span></a></li>
                <li><a href="javascript:void(0);" style="padding-right: 20px;">
                    <span>{{ scene.title || 'Untitled' }}</span>
                </a></li>
            </ul>

            </div>
        </div>

        <div v-if="tab.active === 'content'"  class="es-scene-details-tab-content" style="position:relative; overflow: hidden; height:calc(100vh - 190px);">
            <!--<CommentBasePanelv2 v-bind:class="{ 'show_comments' : show_comments }" v-if="commentbase_dom" :dom="commentbase_dom" :properties="{ book: book,
                parent_name: 'scene', parent_id: scene.uuid, parent: scene, selected_comment:selected_comment, is_reply: true }" ref="commentbasepanelv2"></CommentBasePanelv2>-->
            <Feedback v-if="show_feedbacks" :properties="{ book: book, parent: scene, parent_name: 'scene' }"></Feedback>
            <Note v-if="show_notes" :properties="{ book: book, parent: scene, parent_name: 'scene' }"></Note>
            <!-- footer previous & next -->
            <div style="border-top:1px solid #ccc; z-index:2000; background:#fff; height:50px; padding:0px 20px; line-height:50px; width:100%; position:absolute; bottom:0px; left:0px;">
                <button v-if="prevScene != null && prevType == 'scene'" @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + prevScene.id, tabComponent: 'books-i-read-scene-details',  tabData: { book: book, scene: prevScene, chapter: chapter }, tabTitle: prevScene.title})" style="float:left; background:transparent; border:none;">
                    <i class="las la-angle-double-left"></i> PREV
                </button>
                <button v-if="nextScene != null && nextType == 'scene'" @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + nextScene.id, tabComponent: 'books-i-read-scene-details',  tabData: { book: book, scene: nextScene, chapter: chapter}, tabTitle: nextScene.title})" style="float:right; background:transparent; border:none;">
                    NEXT <i class="las la-angle-double-right"></i>
                </button>

                <button v-if="prevScene != null && prevType == 'chapter'" @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + prevScene.id, tabComponent: 'books-i-read-chapter-details',  tabData: { book: book, chapter: prevScene }, tabTitle: 'VIEW' + ' - ' + prevScene.title})" style="float:left; background:transparent; border:none;">
                    <i class="las la-angle-double-left"></i> PREV
                </button>
                <button v-if="nextScene != null && nextType == 'chapter'" @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + nextScene.id, tabComponent: 'books-i-read-chapter-details',  tabData: { book: book, chapter: nextScene }, tabTitle: 'VIEW' + ' - ' + nextScene.title})" style="float:right; background:transparent; border:none;">
                    NEXT <i class="las la-angle-double-right"></i>
                </button>

            </div>
            <div v-html="scene.content" class="description" v-bind:id="commentbase_id"></div>
        </div>
    </div>
</div>
</template>

<script>
import Feedback from '../../../components/Feedback'
import Note from '../../../components/Note'
import Vue from 'vue'
import CommentBasePanelv2 from '../../../components/CommentBasePanelv2'
// import CommentBasePanel from '../../../components/CommentBasePanel'

export default {
  name: 'books-i-read-scene-details',
  props: ['properties'],
  data: function () {
    // eslint-disable-next-line no-unused-vars
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
      show_feedbacks: false,
        show_comments: false,
        selected_comment: null,
      show_notes: false,
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
      nextType: '',
      prevType: ''
    }
  },
  components: {
    Feedback,
    Note,
      CommentBasePanelv2
    // CommentBasePanel
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
      let previousScene = this.$store.getters.getPrevScene(scene, false)

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
      let nextScene = this.$store.getters.getNextScene(chapter, scene, false)
      // check if there is a next scene
      if (nextScene != null) {
        scope.nextType = 'scene'
        return nextScene
      } else { // if no next scene, then proceed to next chapter
        scope.nextType = 'chapter'
        return this.$store.getters.getNextChapter(chapter, false)
      }
    }
  },
  methods: {
    setDescription (value) {
      var scope = this
      scope.tempVersionDesc = value
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
            await scope.$store.dispatch('loadCommentsByScene', scope.scene.uuid)
        } catch (ex) {
            console.log('Failed to load data')
        } finally {
            setTimeout(function () {
                scope.page.is_ready = true
                scope.changeTab('content')
            }, 500)
        }
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
              document.getElementById('app').focus()
          }

          this.$refs.commentbasepanelv2.sub_comment_msg = '';
          this.$refs.commentbasepanelv2.main_comment_id = null;
          // close all sub_comments
          $.each(this.$refs.commentbasepanelv2.comments, function(k, v) {
              v.show_sub_comments = false;
          });

          scope.show_comments = !scope.show_comments
      },
    toggleNotes: function () {
      let scope = this
      scope.show_notes = !scope.show_notes
    }
  },
  async mounted () {
    var scope = this

    if (scope.properties.openfeedback) {
      scope.show_feedbacks = true
    }

    scope.initializeData()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .es-breadcrumb.special{ max-width: none !important;}
    .export-content{ text-align: right; margin-bottom: 20px;}
    .es-scene-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
    .es-scene-details-tab .es-scene-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
    .es-scene-details-tab .es-scene-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
    .es-scene-details-tab .es-scene-details-tab-item.active:after { background:#922c39;  }

    .es-scene-details-tab-content { position:relative; padding:30px; background:#fff; height: calc(106vh - 319px); overflow-y:auto; display:block; }
    .es-scene-details-tab-content.no-padding { padding:0px; }
    .es-scene-details-tab-content.active { display:block; }
</style>
