<template>
<div v-if="page.is_ready" class="page-chapter-form">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <div  v-if="data.id != null">
                    <h4>{{$t('EDIT')}}: <strong>{{ data.title }}</strong></h4>
                    <small>{{$t('DATE_MODIFIED')}}: {{ data.updated_at }}</small>
                </div>
                <div v-else>
                    <h4>{{$t('CREATE_NEW_CHAPTER')}}</h4>
                </div>
            </div>
            <div class="actions">
                <button v-if="data.id != null" class="es-button-white" @click="saveChapter()">{{$t('SAVE_CHANGES')}}</button>
                <button v-else class="es-button-white" @click="saveChapter()">{{$t('SAVE')}}</button>
            </div>
        </div>
    </div>

  <div class="es-page-content">
        <div class="container">
            <div class="es-accordion">
                <div class="item" v-bind:class="{'active': accordion['chapter-details'] === 'active'}">
                    <div class="label" @click="toggleAccordion('chapter-details')">
                        {{$t('CHAPTER_DETAILS').toUpperCase()}}
                        <div class="icon">
                            <i v-if="accordion['chapter-details'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['chapter-details'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content ">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>{{$t('TITLE')}}: </label>
                                    <input v-model="data.title" type="text" class="form-control" :placeholder = "$t('CHAPTER_TITLE')">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>{{$t('SHORT_DESCRIPTION')}}: </label>
                                    <input v-model.trim="data.short_description" type="text" class="form-control" :placeholder = "$t('SHORT_DESCRIPTION')">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item" v-bind:class="{'active': accordion['content'] === 'active'}">
                    <div class="label" @click="toggleAccordion('content')">
                        {{$t('CONTENT').toUpperCase()}}
                        <div class="icon">
                            <i v-if="accordion['content'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['content'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content ">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <tiny-editor :initValue="data.chapter_version.content" v-on:getEditorContent="setContent" class="form-control" />
                                </div>
                            </div>
                        </div>
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
  name: 'book-form',
  props: ['properties'],
  data: function () {
    return {
      page: {
        is_ready: false,
        title: ''
      },
      data: {
        id: null,
        uuid: null,
        book_id: null,
        title: '',
        short_description: '',
        chapter_version: {
          change_description: '',
          content: ''
        }
      },
      chapterVersionCont: '',
      baseContentCount: '',
      accordion: {
        'chapter-details': 'active',
        'content': 'inactive'
      },
      authorProgress: {
        author_id: '',
        relation_id: '',
        is_for: 'chapter',
        total_words: 0
      }
    }
  },
  components: {
    TinyMCE
  },
  methods: {
    toggleAccordion: function (key) {
      var scope = this
      if (scope.accordion[key] === 'active') {
        scope.accordion[key] = 'inactive'
      } else {
        scope.accordion[key] = 'active'
      }
    },
    // Required for geting value from TinyMCE content
    setContent (value) {
      var scope = this

      scope.chapterVersionCont = value
    },
    saveChapter () {
      var scope = this
      scope.data.chapter_version.content = scope.chapterVersionCont

      scope.axios
        .post('http://localhost:3000/chapters', scope.data)
        .then(response => {
          if (response.data) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              scope.saveAuthorPersonalProgress(response.data.uuid)
              scope.saveChapterHistory(response.data.uuid)
              if (scope.data.uuid === null) {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateChapterList', response.data)
                scope.$store.dispatch('loadVersionsByChapter', response.data.uuid)
                // scope.$store.dispatch('updateChapterVersionList', scope.data.chapter_version)
                scope.CHANGE_COMPONENT({tabKey: 'chapter-details-' + response.data.uuid, tabComponent: 'chapter-details', tabData: { book_id: response.data.book_id, chapter: response.data }, tabTitle: 'View - ' + response.data.title, tabIndex: scope.$store.getters.getActiveTab})
              } else {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateChapterList', response.data)
                scope.$store.dispatch('loadVersionsByChapter', response.data.uuid)
                // scope.$store.dispatch('updateChapterVersionList', scope.data.chapter_version)
                // scope.CHANGE_COMPONENT({tabKey: 'chapter-details-' + response.data.uuid, tabComponent: 'chapter-details', tabData: { book_id: response.data.book_id, chapter: response.data }, tabTitle: 'View - ' + response.data.title, tabIndex: scope.$store.getters.getActiveTab})
                scope.$store.dispatch('changeTabTitle', {key: 'chapter-form-' + response.data.uuid, title: 'Edit -' + response.data.title})
                scope.$store.dispatch('changeTabTitle', {key: 'chapter-details-' + response.data.uuid, title: 'View -' + response.data.title})
              }
            })
          }
        })
    },
    saveChapterHistory (chapterId) {
      let scope = this

      let chapterHistory = {
        chapter_id: chapterId,
        content: scope.data.chapter_version.content
      }

      scope.axios
        .post('http://localhost:3000/book-chapter-history', chapterHistory)
        .then(response => {
          console.log('Chapter history saved!')
        })
    },
    saveAuthorPersonalProgress (relationId) {
      let scope = this

      if (scope.authorProgress.uuid) {
        scope.authorProgress.total_words = scope.authorProgress.total_words + (scope.WORD_COUNT(scope.chapterVersionCont) - scope.baseContentCount)
      } else {
        scope.authorProgress.author_id = scope.$store.getters.getAuthorID
        scope.authorProgress.relation_id = relationId
        scope.authorProgress.total_words = scope.WORD_COUNT(scope.chapterVersionCont) - scope.baseContentCount
      }

      scope.axios
        .post('http://localhost:3000/author-personal-progress', scope.authorProgress)
        .then(response => {
          scope.authorProgress = response
          scope.$store.dispatch('loadAuthorPersonalProgress', { authorId: this.$store.getters.getAuthorID })
        })
    },
    loadChapter () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/chapters/' + scope.data.uuid)
        .then(response => {
          let chapter = response.data
          scope.data.title = chapter.title
          scope.data.short_description = chapter.short_description
          if (chapter.chapter_version[chapter.chapter_version.length - 1]) {
            scope.data.chapter_version.id = chapter.chapter_version[chapter.chapter_version.length - 1].id
            scope.data.chapter_version.uuid = chapter.chapter_version[chapter.chapter_version.length - 1].uuid
            scope.data.chapter_version.content = chapter.chapter_version[chapter.chapter_version.length - 1].content
            scope.chapterVersionCont = scope.data.chapter_version.content

            scope.baseContentCount = scope.WORD_COUNT(scope.chapterVersionCont)

            // refresh vuex to update all related records
            scope.$store.dispatch('loadVersionsByChapter', scope.page.data.chapter.uuid)
          }
        })

      scope.axios
        .get('http://localhost:3000/authors/' + scope.$store.getters.getAuthorID + '/chapter/' + scope.data.uuid + '/personal-progress/today')
        .then(response => {
          if (response.data) {
            console.log(response.data)
            scope.authorProgress = response.data
          }
        })
    }
  },
  beforeMount () {
    var scope = this
    scope.data.book_id = scope.properties.book_id

    if (scope.properties.chapter) {
      scope.$set(scope.data, 'id', scope.properties.chapter.id)
      scope.$set(scope.data, 'uuid', scope.properties.chapter.uuid)
      scope.$store.dispatch('loadVersionsByChapter', scope.properties.chapter.uuid)
    }
  },
  mounted () {
    var scope = this
    if (scope.data.uuid) {
      setTimeout(function () {
        let chapter = scope.$store.getters.findChapter(scope.properties.chapter)
        let version = scope.$store.getters.findLatestChapterVersionByChapter(scope.properties.chapter)
        // chapter
        scope.data.title = chapter.title
        scope.data.short_description = chapter.short_description

        // version
        scope.data.chapter_version.id = version.id
        scope.data.chapter_version.uuid = version.uuid
        scope.data.chapter_version.content = version.content
        scope.chapterVersionCont = version.content
      }, 500)
    }

    setTimeout(function () {
      scope.page.is_ready = true
    }, 550)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
    .page-title h3 { font-size:35px; }

    .single-picture-file { display: none }
    .uploaded-file-preview { width:100%; cursor: pointer; }
    .uploaded-file-preview img { width:100%; }
    .uploaded-file-preview .default-preview { min-height: 180px; background-color: #293742; color: #fff; text-align: center; }
    .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 180px; opacity: 0.8; }

    .es-accordion .item { background:#fafafa; border-bottom:2px solid #e0e5ee; padding:10px 15px; }
    .es-accordion .item .label { position:relative; cursor:pointer; }
    .es-accordion .item .label .icon { position:absolute; top:0px; right:0px; }
    .es-accordion .item .content { display:none; margin-top:20px; margin-bottom:20px; }
    .es-accordion .item.active .content { display:block; }
</style>
