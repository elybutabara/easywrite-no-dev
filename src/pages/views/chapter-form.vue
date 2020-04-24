<template>
<div v-if="page.is_ready" class="page-chapter-form">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <div  v-if="data.id != null">
                    <h4>Edit: <strong>{{ data.title }}</strong></h4>
                    <small>Date Modified: {{ data.updated_at }}</small>
                </div>
                <div v-else>
                    <h4>Create New Chapter</h4>
                </div>
            </div>
            <div class="actions">
                <button v-if="data.id != null" class="es-button-white" @click="saveChapter()">Save Changes</button>
                <button v-else class="es-button-white" @click="saveChapter()">Save</button>
            </div>
        </div>
    </div>

  <div class="es-page-content">
        <div class="container">
            <div class="es-accordion">
                <div class="item" v-bind:class="{'active': accordion['chapter-details'] === 'active'}">
                    <div class="label" @click="toggleAccordion('chapter-details')">
                        CHAPTER DETAILS
                        <div class="icon">
                            <i v-if="accordion['chapter-details'] === 'active'" class="fas fa-chevron-down"></i>
                            <i v-if="accordion['chapter-details'] !== 'active'" class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    <div class="content ">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>Title: </label>
                                    <input v-model="data.title" type="text" class="form-control" placeholder="Chapter Title">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label>Short Description: </label>
                                    <input v-model.trim="data.short_description" type="text" class="form-control" placeholder="Short Description">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item" v-bind:class="{'active': accordion['content'] === 'active'}">
                    <div class="label" @click="toggleAccordion('content')">
                        CONTENT
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
      accordion: {
        'chapter-details': 'active',
        'content': 'inactive'
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

      // scope.data.chapter_version.content = value
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
              title: 'Chapter successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              if (scope.data.uuid === null) {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateChapterList', response.data)
                scope.CHANGE_COMPONENT({tabKey: 'chapter-details-' + response.data.uuid, tabComponent: 'chapter-details', tabData: { book_id: response.data.book_id, chapter: response.data }, tabTitle: 'View - ' + response.data.title, tabIndex: scope.$store.getters.getActiveTab})
              } else {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.$store.dispatch('updateChapterList', response.data)
                // scope.CHANGE_COMPONENT({tabKey: 'chapter-details-' + response.data.uuid, tabComponent: 'chapter-details', tabData: { book_id: response.data.book_id, chapter: response.data }, tabTitle: 'View - ' + response.data.title, tabIndex: scope.$store.getters.getActiveTab})
                scope.$store.dispatch('changeTabTitle', {key: 'chapter-form-' + response.data.uuid, title: 'Edit -' + response.data.title})
              }
            })
          }
        })
    },
    saveNewVersion () {

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

            // refresh vuex to update all related records
            scope.LOAD_LIST('chapter-versions', chapter)
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
