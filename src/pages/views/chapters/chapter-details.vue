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
                <div class="actions">
                    <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'chapter-form', tabComponent: 'chapter-form', tabData: { book: book, chapter: null }, tabTitle: $t('NEW_CHAPTER'), newTab: true})">{{$t('NEW_CHAPTER').toUpperCase()}}</button>
                    <button class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'scene-form-' + chapter.uuid, tabComponent: 'scene-form',  tabData: { book: book, chapter: chapter, scene: null }, tabTitle: 'New Scene', newTab: true})">{{$t('ADD_NEW_SCENE').toUpperCase()}}</button>
                    <button ref="button" class="es-button-white" :disabled="busy" @click="newVersion">{{$t('SAVE_AS_NEW_VERSION').toUpperCase()}}</button>
                    <button class="es-button-white" @click="CHANGE_COMPONENT({ tabKey: 'chapter-form-' + chapter.uuid, tabComponent: 'chapter-form',  tabData: { book: book, chapter:  chapter }, tabTitle: $t('EDIT')+ ' - ' +  chapter.title, newTab: true })">{{$t('EDIT').toUpperCase()}}</button>
                    <button class="es-button-white" @click="deleteChapter(chapter)">{{$t('DELETE').toUpperCase()}}</button>
                </div>
            </div>
        </div>
        <div class="es-page-breadcrumbs">
            <button @click="CHANGE_COMPONENT({tabKey: 'book-details-' + book.uuid, tabComponent: 'book-details', tabData: book, tabTitle: book.title})">{{ book.title }}</button>
            /
            <button @click="CHANGE_COMPONENT({tabKey: 'chapter-listing-' + book.uuid, tabComponent: 'chapter-listing', tabData: book, tabTitle: $t('CHAPTERS') + ' - ' + book.title})">{{ $t('CHAPTERS') }}</button>
            /
            <button class="current">{{ chapter.title }}</button>
        </div>
        <div class="es-chapter-details-tab">
            <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-chapter-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'scenes' }" @click="changeTab('scenes')" class="es-chapter-details-tab-item">{{$t('SCENES').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'versions' }" @click="changeTab('versions')" class="es-chapter-details-tab-item">{{$t('VERSIONS').toUpperCase()}}</div>
            <div v-bind:class="{ 'active' : tab.active == 'compare-versions' }" @click="changeTab('compare-versions')" class="es-chapter-details-tab-item">{{$t('COMPARE_VERSIONS').toUpperCase()}}</div>
        </div>
        <div v-if="tab.active === 'content'"  class="es-chapter-details-tab-content">
<!--            <div class="export-content"><button class="es-button-white" @click="exportContent()">{{$t('EXPORT_CONTENT')}}</button></div>-->
            <div class="export-content">
              <b-button class="es-button-white" :disabled="exportOnProgress"  @click="exportContent()">
                <div v-if="exportOnProgress === false"><span>{{$t('EXPORT_CONTENT')}}</span></div>
                <div v-else>
                  <b-spinner small type="grow"></b-spinner>
                  <span>{{exportLoading}}</span>
                </div>
              </b-button>
            </div>
            <div v-html="getChapterContent" class="description" v-commentbase="commentbase_params"></div>
        </div>
        <div v-if="tab.active === 'scenes'"  class="es-chapter-details-tab-content scene-listing">
            <chapter-scenes :properties="{ book: book, chapter: chapter }"></chapter-scenes>
        </div>
        <div v-if="tab.active === 'versions'"  class="es-chapter-details-tab-content">
            <chapter-versions :properties="{ chapter: chapter }"></chapter-versions>
        </div>
        <div v-if="tab.active === 'compare-versions'"  class="es-chapter-details-tab-content">
            <chapter-compare-versions :properties="{ chapter: chapter }"></chapter-compare-versions>
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
                        <b-card :header="$t('SAVE_AS_NEW_VERSION')" class="text-center">
                            <b-row style="margin-bottom: 1rem;" class="text-left">
                                <b-col>
                                    <label>{{$t('DESCRIPTION')}}: </label>
                                    <tiny-editor :initValue="chapter_version.change_description"
                                                 v-on:getEditorContent="setDescription"
                                                 class="form-control"
                                    />
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <div class="text-right">
                                        <b-button variant="outline-dark" class="mr-2" @click="busy = !busy">{{$t('CANCEL')}}</b-button><b-button variant="dark" @click="saveNewVersion">{{$t('SAVE')}}</b-button>
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
</template>

<script>
import TinyMCE from '../../../components/TinyMCE'
import ChapterScenes from '@/pages/views/chapters/chapter-scenes'
import ChapterVersions from '@/pages/views/chapters/chapter-versions'
import ChapterCompareVersions from '@/pages/views/chapters/chapter-compare-versions'
import moment from 'moment'
import Vue from 'vue'

import CommentBase from '../../../components/CommentBase'

const {ipcRenderer} = window.require('electron')

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
      },
      exportOnProgress: false,
      exportLoading: this.$t('Loading')
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
    newVersion: function () {
      var scope = this
      this.busy = true

      scope.chapter_version.change_description = ''
      if (scope.chapter_version.id) {
        delete (scope.chapter_version.id)
        delete (scope.chapter_version.uuid)
      }
    },
    saveNewVersion () {
      var scope = this

      scope.chapter_version.change_description = scope.tempVersionDesc
      scope.chapter_version.content = scope.getChapterContent
      scope.chapter_version.chapter_id = scope.page.data.chapter.uuid

      scope.axios
        .post('http://localhost:3000/chapter-versions', scope.chapter_version)
        .then(response => {
          if (response.data) {
            // TODO: Insert vuex code that will refresh the chapter version
            scope.tab.active = 'content'
            scope.$store.dispatch('loadVersionsByChapter', scope.page.data.chapter.uuid)
            this.busy = false
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('CHAPTER') + ' ' + this.$t('VERSION') + ' ' + this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.tab.active = 'versions'
            })
          }
        })
    },
    saveComments () {
      var scope = this
      var chapterID = scope.page.data.chapter.uuid

      scope.chapter_version.chapter_id = chapterID
      scope.chapter_version.uuid = this.$store.getters.getChapterVersionUUID(chapterID)
      scope.chapter_version.change_description = scope.tempVersionDesc
      scope.chapter_version.content = this.commentbase_vm.getContent()
      scope.chapter_version.comments = this.commentbase_vm.getCommentsJSON()

      scope.axios
        .post('http://localhost:3000/chapter-versions/comment', scope.chapter_version)
        .then(response => {
          if (response.data) {
            // TODO: Insert vuex code that will refresh the chapter version
            scope.tab.active = 'content'
            // scope.$store.dispatch('loadVersionsByChapter', scope.page.data.chapter.uuid)
            this.busy = false
          }
        })
    },
    deleteChapter: function (chapter) {
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
            .delete('http://localhost:3000/chapters/' + chapter.uuid)
            .then(response => {
              if (response.data) {
                window.swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: this.$t('RECORD_SUCCESSFULY_DELETED'),
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  scope.$store.dispatch('removeChapterFromList', chapter)
                  scope.CHANGE_COMPONENT({tabKey: 'chapter-listing-' + chapter.book_id, tabComponent: 'chapter-listing', tabData: { uuid: chapter.book_id }, tabTitle: this.$t('CHAPTERS') + ' - ' + this.$t('LIST'), tabIndex: scope.$store.getters.getActiveTab})
                })
              }
            })
        }
      })
    },
    exportContent: function () {
      var scope = this
      scope.exportOnProgress = true
      ipcRenderer.send('EXPORT-CONTENT-DOCX', {content: scope.getChapterContent, defaultfilename: scope.page.title + ' - ' + this.$t('CONTENT')})
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

    ipcRenderer.on('EXPORT_DOCX_ENABLE_BUTTON', function () {
      scope.exportOnProgress = false
    })
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
