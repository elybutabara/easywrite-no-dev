<template>
<div>
    <div v-if="page.is_ready" class="page-chapter-details">
        <div class="es-page-head">
            <div class="inner">
                <div class="details">
                    <div>
                      <h4><strong>{{ chapter.title }}</strong></h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'books-i-read-book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'books-i-read-chapter-listing', tabData: book, tabTitle: $tc('CHAPTER', 2) + ' - ' + book.title})">{{ $tc('CHAPTER', 2) }}</button>
            /
            <button class="current">{{ chapter.title }}</button>
        </div>
        <div class="es-chapter-details-tab">
            <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-chapter-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'scenes' }" @click="changeTab('scenes')" class="es-chapter-details-tab-item">{{$tc('SCENE', 2).toUpperCase()}}</div>
        </div>
        <div v-if="tab.active === 'content'"  class="es-chapter-details-tab-content">
            <div v-html="getChapterContent" class="description" v-commentbase="commentbase_params"></div>
        </div>
        <div v-if="tab.active === 'scenes'"  class="es-chapter-details-tab-content scene-listing">
            <books-i-read-chapter-scenes :properties="{ book: book, chapter: chapter }"></books-i-read-chapter-scenes>
        </div>
    </div>
</div>
</template>

<script>
import TinyMCE from '../../../components/TinyMCE'
import ChapterScenes from '@/pages/views/chapters/chapter-scenes'
import ChapterVersions from '@/pages/views/chapters/chapter-versions'
import ChapterCompareVersions from '@/pages/views/chapters/chapter-compare-versions'
import moment from 'moment'
import Vue from 'vue'

import CommentBase from '../../../components/CommentBase'

// const {ipcRenderer} = window.require('electron')

export default {
  name: 'chapter-details',
  props: ['properties'],
  directives: {
    commentbase: CommentBase
  },
  data: function () {
    var scope = this
    return {
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
    ChapterScenes,
    ChapterVersions,
    ChapterCompareVersions
  },
  computed: {
    getChapterContent: function () {
      var scope = this
      var chapterID = scope.page.data.chapter.uuid
      return this.$store.getters.getChapterContent(chapterID)
    },
    comments: function () {
      var scope = this
      var chapterID = scope.page.data.chapter.uuid
      return this.$store.getters.getChapterComments(chapterID)
    },
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
    }
  },
  methods: {
    // Required for geting value from TinyMCE content
    setDescription (value) {
      var scope = this
      scope.tempVersionDesc = value
    },
    changeTab: function (active) {
      var scope = this
      scope.tab.active = active
    },
    saveComments () {
      var scope = this
      var chapterID = scope.page.data.chapter.uuid

      scope.chapter_version.chapter_id = chapterID
      scope.chapter_version.uuid = this.$store.getters.getChapterVersionUUID(chapterID)
      scope.chapter_version.change_description = scope.tempVersionDesc
      scope.chapter_version.content = this.commentbase_vm.getContent()
      scope.chapter_version.comments = this.commentbase_vm.getCommentsJSON()

      /*
      var data = Object.assign({}, scope.chapter_version, {
        chapter_id: chapterID,
        uuid: this.$store.getters.getChapterVersionUUID(chapterID),
        change_description: scope.tempVersionDesc,
        content: this.commentbase_vm.getContent(),
        comments: this.commentbase_vm.getCommentsJSON()
      })
      */

      scope.axios
        .post('http://localhost:3000/chapter-versions/comment', scope.chapter_version)
        .then(response => {
          if (response.data) {
            // TODO: Insert vuex code that will refresh the chapter version
            scope.tab.active = 'content'
            scope.$store.dispatch('loadVersionsByChapter', scope.page.data.chapter.uuid)
            this.busy = false
            /*
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('CHAPTER') + ' ' + this.$t('VERSION') + ' ' + this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.tab.active = 'content'
            })
            */
          }
        })
    }
  },
  beforeUpdate () {
    // var scope = this
  },
  mounted () {
    var scope = this

    scope.page.data = scope.properties
    scope.page.title = scope.properties.chapter.title
    // console.log('PROPERTIES')
    // console.log(scope.properties)
    scope.$store.dispatch('loadScenesByChapter', scope.properties.chapter.uuid)
    scope.$store.dispatch('loadVersionsByChapter', scope.properties.chapter.uuid)

    setTimeout(function () {
      Vue.nextTick(function () {
        scope.page.is_ready = true
        scope.changeTab('content')
      })
    }, 300)
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

    .es-chapter-details-tab-content { position:relative; padding:30px; background:#fff; height:calc(100vh - 247px); overflow-y:auto; display:block; }
    .es-chapter-details-tab-content.no-padding { padding:0px; }
    .es-chapter-details-tab-content.active { display:block; }
</style>
