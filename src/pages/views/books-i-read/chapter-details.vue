a<template>
<div>
    <div v-if="page.is_ready" class="es-page-main page-chapter-details">
        <div class="es-page-head-2 mb-0">
            <div class="row-head">
                <div>
                  <h4 class="main-title"><i class="fas fa-bookmark mr-1"></i> {{ chapter.title }}</h4>
                </div>
                <div class="book-panel-right">
                  <button class="es-button btn-sm white" @click="toggleNotes()">{{$t('MY_NOTES').toUpperCase()}}</button>
                    <!--<button class="es-button btn-sm white view-comments" v-if="commentbase_dom" @click="toggleComments()">{{('VIEW COMMENTS').toUpperCase()}}</button>-->
                  <a class="es-button btn-sm w-icon icon-left warning" @click="toggleFeedbacks()"><i class="las la-comments"></i> {{$t('FEEDBACKS')}}</a>
                </div>
            </div>
        </div>
        <!-- <div class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'books-i-read-chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})">{{ $t('CHAPTERS') }}</button>
            /
            <button class="current">{{ chapter.title }}</button>
        </div> -->
        <div class="es-details-tab-wrapper">
              <div class="es-details-tab">
                  <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
                  <div v-bind:class="{ 'active' : tab.active == 'scenes' }" @click="changeTab('scenes')" class="es-details-tab-item">{{$t('SCENES').toUpperCase()}}</div>
              </div>
              <div>
                  <ul class="es-breadcrumb special mb-0">
                      <li><a @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})" href="javascript:void(0);"><span>{{ book.title }}</span></a></li>
                      <li><a @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'books-i-read-chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})" href="javascript:void(0);"><span>{{ $t('CHAPTERS') }}</span></a></li>
                      <li><a href="javascript:void(0);" style="padding-right: 20px;"><span>{{ chapter.title }}</span></a></li>
                  </ul>
              </div>
        </div>
        <div style="position:relative; padding-bottom:40px; overflow: hidden;">
            <!--<CommentBasePanelv2 v-bind:class="{ 'show_comments' : show_comments }" v-if="commentbase_dom" :dom="commentbase_dom" :properties="{ book: book,
            parent_name: 'chapter', parent_id: chapter.uuid, parent: chapter, selected_comment: selected_comment, is_reply: true }" ref="commentbasepanelv2"></CommentBasePanelv2>-->
          <Feedback v-bind:class="{ 'show_feedbacks' : show_feedbacks }" :properties="{ book: book, parent: chapter, parent_name: 'chapter', toggleType: true }"></Feedback>
          <Note v-if="show_notes" :properties="{ book: book, parent: chapter, parent_name: 'chapter' }"></Note>

          <!-- footer previous & next -->
          <div style="border-top:1px solid #ccc; z-index:2000; background:#fff; height:50px; padding:0px 20px; line-height:50px; width:100%; position:absolute; bottom:0px; left:0px;">

              <button v-if="prevScene != null && prevType == 'chapter'" @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + prevScene.id, tabComponent: 'books-i-read-chapter-details',  tabData: { book: book, chapter: prevScene }, tabTitle: 'VIEW' + ' - ' + prevScene.title})" style="float:left; background:transparent; border:none;">
                  <i class="las la-angle-double-left"></i> {{ $t('PREV') }}
              </button>
              <button v-if="nextScene != null && nextType == 'chapter'" @click="CHANGE_COMPONENT({tabKey: 'chapter-details-' + nextScene.id, tabComponent: 'books-i-read-chapter-details',  tabData: { book: book, chapter: nextScene }, tabTitle: 'VIEW' + ' - ' + nextScene.title})" style="float:right; background:transparent; border:none;">
                  {{ $t('NEXT') }} <i class="las la-angle-double-right"></i>
              </button>

              <button v-if="prevScene != null && prevType == 'scene'" @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + prevScene.id, tabComponent: 'books-i-read-scene-details',  tabData: { book: book, scene: prevScene, chapter: previousChapter}, tabTitle: prevScene.title})" style="float:left; background:transparent; border:none;">
                  <i class="las la-angle-double-left"></i> {{ $t('PREV') }}
              </button>
              <button v-if="nextScene != null && nextType == 'scene'" @click="CHANGE_COMPONENT({tabKey: 'scene-details-' + nextScene.id, tabComponent: 'books-i-read-scene-details',  tabData: { book: book, scene: nextScene, chapter: chapter}, tabTitle: nextScene.title})" style="float:right; background:transparent; border:none;">
                  {{ $t('NEXT') }} <i class="las la-angle-double-right"></i>
              </button>

          </div>

          <div v-if="tab.active === 'content'"  class="es-chapter-details-tab-content">
              <div v-html="chapter.content" class="description" v-bind:id="commentbase_id"></div>
          </div>
          <div v-if="tab.active === 'scenes'"  class="es-chapter-details-tab-content scene-listing">
              <books-i-read-chapter-scenes :properties="{ book: book, chapter: chapter }"></books-i-read-chapter-scenes>
          </div>
        </div>
    </div>
</div>
</template>

<script>
import Feedback from '../../../components/Feedback'
import Note from '../../../components/Note'
import TinyMCE from '../../../components/TinyMCE'
import ChapterScenes from '@/pages/views/books-i-read/chapter-scenes'
import ChapterVersions from '@/pages/views/chapters/chapter-versions'
import ChapterCompareVersions from '@/pages/views/chapters/chapter-compare-versions'
import moment from 'moment'
import Vue from 'vue'
import CommentBasePanelv2 from '../../../components/CommentBasePanelv2'
// import CommentBasePanel from '../../../components/CommentBasePanel'

// const {ipcRenderer} = window.require('electron')

export default {
  name: 'books-i-read-chapter-details',
  props: ['properties'],
  data: function () {
    // eslint-disable-next-line no-unused-vars
    var scope = this
    return {
      show_feedbacks: false,
        show_comments: false,
        selected_comment: null,
      notification: null,
      show_notes: false,
      chapter_version: {
        chapter_id: null,
        content: '',
        change_description: ''
      },
      page: {
        title: '',
        is_ready: false,
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
      nextType: '',
      prevType: '',
      previousChapter: ''
    }
  },
  components: {
    TinyMCE,
    Feedback,
    Note,
    'books-i-read-chapter-scenes': ChapterScenes,
    ChapterVersions,
    ChapterCompareVersions,
      CommentBasePanelv2
    // CommentBasePanel
  },
  computed: {
    // getChapterContent: function () {
    //   var scope = this
    //   var chapterID = scope.page.data.chapter.uuid
    //   return this.$store.getters.getChapterContent(chapterID)
    // },
    // comments: function () {
    //   var scope = this
    //   var chapterID = scope.page.data.chapter.uuid
    //   return this.$store.getters.getChapterComments(chapterID)
    // },
    book: function () {
      return this.properties.book
    },
    chapter: function () {
      return this.properties.chapter
    },
    test: function () {
      var stillUtc = moment.utc('2020-04-09 13:51:40').toDate()
      var date = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss')
      return moment('2020-04-09 21:51:40').utc().format('YYYY-MM-DD HH:mm:ss').toString() + ' ---> ' + date
    },
    getAuthor: function () {
      var scope = this
      return scope.$store.getters.getAuthor
    },
    prevScene: function () {
      let chapter = this.chapter
      let scope = this
      scope.previousChapter = this.$store.getters.getPrevChapter(chapter, false)

      // check if there is prev chapter
      if (scope.previousChapter != null) {
        // if there is a previous chapter - load the scenes of the previous chapter
        scope.$store.dispatch('loadScenesByChapter', scope.previousChapter.uuid)

        // check if there is a scene -not including the hidden
        let notHiddenRows = this.$store.getters.getScenesByChapter(scope.previousChapter.uuid)

        for (var i = 0; i < notHiddenRows.length; i++) {
          if (notHiddenRows[i].hidden) {
            notHiddenRows.splice(i, 1)
          }
        }

        if (notHiddenRows.length > 0) { // if previous chapter has scene - return scene
          scope.prevType = 'scene'
          return notHiddenRows[notHiddenRows.length - 1] // last scene
        } else { // if no scene under chapter then return the next chapter
          scope.prevType = 'chapter'
          return this.$store.getters.getPrevChapter(chapter, false)
        }
      }
      return null
    },
    nextScene: function () {
      let chapter = this.chapter
      let scope = this

      // check if there is a scene -not including the hidden
      let notHiddenRows = this.$store.getters.getScenesByChapter(chapter.uuid)

      console.log('not hiddden rows', notHiddenRows, chapter.uuid)

      for (var i = 0; i < notHiddenRows.length; i++) {
        if (notHiddenRows[i].hidden) {
          notHiddenRows.splice(i, 1)
        }
      }

      if (notHiddenRows.length > 0) { // if chapter has scene - return scene
        scope.nextType = 'scene'
        return notHiddenRows[0]
      } else { // if no scene under chapter then return the next chapter
        scope.nextType = 'chapter'
        return this.$store.getters.getNextChapter(chapter, false)
      }
    }
  },
  methods: {
    // Required for geting value from TinyMCE content
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
    // saveComments () {
    //   var scope = this
    //   var chapterID = scope.page.data.chapter.uuid
    //
    //   scope.chapter_version.chapter_id = chapterID
    //   scope.chapter_version.uuid = this.$store.getters.getChapterVersionUUID(chapterID)
    //   scope.chapter_version.change_description = scope.tempVersionDesc
    //   scope.chapter_version.content = this.commentbase_vm.dom.innerHTML
    //   scope.chapter_version.comments = this.commentbase_vm.getCommentsJSON()
    //   scope.chapter_version.new_comment_json = this.commentbase_vm.getLastComment()
    //   scope.chapter_version.new_comment_json.chapter_id = chapterID
    //   scope.chapter_version.new_comment_json.chapter_title = scope.page.data.chapter.title
    //   scope.chapter_version.new_comment_json = JSON.stringify(scope.chapter_version.new_comment_json)
    //
    //   /*
    //   var data = Object.assign({}, scope.chapter_version, {
    //     chapter_id: chapterID,
    //     uuid: this.$store.getters.getChapterVersionUUID(chapterID),
    //     change_description: scope.tempVersionDesc,
    //     content: this.commentbase_vm.getContent(),
    //     comments: this.commentbase_vm.getCommentsJSON()
    //   })
    //   */
    //
    //   scope.axios
    //     .post('http://localhost:3000/chapter-versions/comment', scope.chapter_version)
    //     .then(response => {
    //       if (response.data) {
    //         // TODO: Insert vuex code that will refresh the chapter version
    //         scope.tab.active = 'content'
    //         scope.$store.dispatch('loadVersionsByChapter', scope.page.data.chapter.uuid)
    //         this.busy = false
    //         /*
    //         window.swal.fire({
    //           position: 'center',
    //           icon: 'success',
    //           title: this.$t('CHAPTER') + ' ' + this.$t('VERSION') + ' ' + this.$t('SUCCESSFULY_SAVED'),
    //           showConfirmButton: false,
    //           timer: 1500
    //         }).then(() => {
    //           scope.tab.active = 'content'
    //         })s
    //         */
    //       }
    //     })
    // },
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
  beforeUpdate () {
    // var scope = this
  },
  async mounted () {
    var scope = this

    if (scope.properties.openfeedback) {
      scope.show_feedbacks = true
    }
    if (scope.properties.notification) {
      scope.notification = scope.properties.notification
    }

      if(scope.properties.action){
          if (scope.properties.action.includes('open-inline-comment')) {
              scope.show_comments = true
              scope.selected_comment = scope.properties.comment;
          }
      }

    console.log(scope.notification)
    scope.page.data = scope.properties
    scope.page.title = scope.properties.chapter.title
    // console.log('PROPERTIES')
    // console.log(scope.properties)

    try {
      await scope.$store.dispatch('loadScenesByChapter', scope.properties.chapter.uuid)
      await scope.$store.dispatch('loadVersionsByChapter', scope.properties.chapter.uuid)
      await scope.$store.dispatch('loadCommentsByChapter', scope.properties.chapter.uuid)
    } catch (ex) {
      console.log('Failed to load data')
    } finally {
      Vue.nextTick(function () {
        scope.page.is_ready = true
        scope.changeTab('content')
      })
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .export-content{ text-align: right; margin-bottom: 20px;}
    .btn-edit { float:right; background:#fff; border:1px solid #506d84; }
    /*.chapter-scenes-list .item { font-family: 'Crimson Roman Bold'; border:1px solid #354350; border-top:none; padding:0px 20px; height:35px; line-height:35px}*/
    /*.chapter-scenes-list .item:first-child { border-top:1px solid #354350;  }*/

    .image-container { text-align: center; }
    .image-container img { width:100%; max-width:250px; }

    .es-chapter-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
    .es-chapter-details-tab .es-chapter-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
    .es-chapter-details-tab .es-chapter-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
    .es-chapter-details-tab .es-chapter-details-tab-item.active:after { background:#922c39;  }
</style>
