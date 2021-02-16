<template>
<div class="export-book-chapter-scene">
  <div class="form-group">
    <div class="d-flex justify-content-between">
      <strong class="form-label">EXPORT OPTIONS:</strong>
      <span v-if="export_option === 'export_all'">Word count: {{ countAllBookWords }}</span>
      <span v-else>Word count: {{ word_count }}</span>
    </div>
    <div class="export-options">
      <input id="se_all" v-model="export_option" type="radio" value="export_all" @click="resetData()">
      <label for="se_all" class="mr-3">Export All</label>
      <input id="se_op" v-model="export_option" type="radio" value="select_options" @click="word_count = 0">
      <label for="se_op">Filter Options</label>
    </div>
    <div v-if="export_option === 'select_options'">
      <strong class="form-label">Select Chapters:</strong>
      <div class="container-fluid">
        <div class="row chapters-wrap">
          <div v-for="chapter in chapters" v-bind:key="'chapter-' + chapter.id" class="col-lg-6 col-sm-12">
            <div class="chapter-wrap mb-1">
              <div class="d-flex align-items-center p-1 pl-2">
                <input
                  @click="toggleChapterCheckbox(chapter)"
                  v-model="selected_chapters"
                  type="checkbox"
                  class="mr-1"
                  :value="chapter.id"
                  :id="'chckbx-chapter-' + chapter.id"
                >
                <label :for="'chckbx-chapter-' + chapter.id">{{ chapter.title }}</label>
              </div>
              <div :id="'scenes-'+ chapter.id" style="display: none; border-top: 1px solid #eee;" class="p-2">
                <div v-for="scene in scenes" v-bind:key="'scene-' + scene.id">
                  <div class="pl-3" v-if="scene.chapter_id == chapter.uuid">

                    <input
                      @click="toggleSceneCheckbox(scene)"
                      v-model="selected_scenes"
                      type="checkbox"
                      :value="scene.id"
                      :id="'chckbx-scene-' + scene.id"
                    >
                    <label :for="'chckbx-scene-' + scene.id">
                        <span v-if="scene.title && scene.title != null && scene.title != ''">{{ scene.title }}</span>
                        <span v-else>New Scene (Untitled)</span>
                    </label>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="form-group">
    <button @click="exportBook()" type="button">EXPORT</button>
  </div>
</div>
</template>

<script>
// In renderer process (web page).
// import axios from 'axios'
const {ipcRenderer} = window.require('electron')

export default {
  name: 'ExportBookChapterScene',
  props: ['properties'],
  data () {
    return {
      export_option: 'export_all',
      selected_chapters: [],
      selected_scenes: [],
      word_count: 0,
      chapterCheckboxes: {},
      sceneCheckboxes: {}
    }
  },
  directives: { },
  components: { },
  methods: {
    getChapterOrSceneContent (data, type) {
      var hasCurrentVersion = false
      var finalContent = ''
      // console.log('func-', type, data)

      if (data[`${type}_version`] && data[`${type}_version`].length > 1) {
        // has many versions
        for (var version of data[`${type}_version`]) {
          if (version.is_current_version) {
            // alert('has current v')
            hasCurrentVersion = true
            finalContent = version.content
            return finalContent
          }
        }

        // Exception: sometimes is_current_version=0, so pick latest
        if (!hasCurrentVersion) {
          var max = 0
          for (var i = 0; i < data[`${type}_version`].length; i++) {
            if (data[`${type}_version`][i].id > max) {
              // alert('max id')
              max = data[`${type}_version`][i].id
              finalContent = data[`${type}_version`][i].content
            }
          }
          return finalContent
        }
      } else if (data[`${type}_version`].length == 0) {
        // alert('no versions')
        finalContent = ''
        return finalContent
      } else {
        // then has only 1 version
        // alert('has 1 v')
        finalContent = data[`${type}_version`][0].content
        return finalContent
      }
    },

    toggleChapterCheckbox (chapter) {
      var scope = this

      window.$('#scenes-' + chapter.id).toggle()

      if (scope.chapterCheckboxes['chapter-isChecked-' + chapter.id]) {
        scope.chapterCheckboxes['chapter-isChecked-' + chapter.id] = false
      } else {
        scope.chapterCheckboxes['chapter-isChecked-' + chapter.id] = true
      }

      var chapterContent = scope.getChapterOrSceneContent(chapter, 'chapter')

      if (scope.chapterCheckboxes['chapter-isChecked-' + chapter.id]) {
        // if chapterCheckbox is check then count words
        scope.word_count = scope.word_count + scope.WORD_COUNT(chapterContent)
        return scope.word_count
      }
      scope.word_count = scope.word_count - scope.WORD_COUNT(chapterContent)
    },

    toggleSceneCheckbox (scene) {
      var scope = this

      if (scope.sceneCheckboxes['scene-isChecked-' + scene.id]) {
        scope.sceneCheckboxes['scene-isChecked-' + scene.id] = false
      } else {
        scope.sceneCheckboxes['scene-isChecked-' + scene.id] = true
      }

      var sceneContent = scope.getChapterOrSceneContent(scene, 'scene')

      if (scope.sceneCheckboxes['scene-isChecked-' + scene.id]) {
        scope.word_count = scope.word_count + scope.WORD_COUNT(sceneContent)
        return scope.word_count
      }
      scope.word_count = scope.word_count - scope.WORD_COUNT(sceneContent)
    },

    exportBook () {
      var scope = this
      var exportAll = false

      if (scope.export_option == 'export_all') {
        exportAll = true
      }

      if (scope.export_option === 'select_options' && scope.selected_chapters.length === 0) {
        alert('You need to select a Chapter.')
        return false
      }

      scope.$store.commit('exportBookStatusOpen')

      let data = {
        book: scope.properties,
        selected_chapters: scope.selected_chapters,
        selected_scenes: scope.selected_scenes,
        export_all: exportAll
      }

      ipcRenderer.send('EXPORT-DOCX-SHOW-BOOK-WINDOW', data)
      ipcRenderer.on('CHANGE-EXPORT-BOOK-BUTTON-NAME', function (event, data) {
        scope.exportOnProgress = false
        scope.export_book = scope.$t('EXPORT_BOOK')
      })
    },

    resetData () {
      var scope = this
      scope.selected_chapters = []
      scope.selected_scenes = []
      scope.word_count = 0
      scope.chapterCheckboxes = {}
      scope.sceneCheckboxes = {}
    },

    countChaptersWords (chapters) {
      var scope = this
      var wordCount = 0
      for (var chapter of chapters) {
        var chapterContent = scope.getChapterOrSceneContent(chapter, 'chapter')
        wordCount = wordCount + scope.WORD_COUNT(chapterContent)
      }
      return wordCount
    },
    countSceneWords (scenes) {
      var scope = this
      var wordCount = 0
      for (var scene of scenes) {
        var sceneContent = scope.getChapterOrSceneContent(scene, 'scene')
        wordCount = wordCount + scope.WORD_COUNT(sceneContent)
      }
      return wordCount
    }

  },
  computed: {
    chapters: function () {
      let scope = this
      let chapters = scope.$store.getters.getChaptersByBook(scope.properties.uuid)
      return chapters
    },
    scenes: function () {
      let scope = this
      let scenes = scope.$store.getters.getScenesByBook(scope.properties.uuid)
      return scenes
    },
    countAllBookWords: function () {
      let scope = this
      var chapters = scope.countChaptersWords(scope.chapters)
      var scenes = scope.countSceneWords(scope.scenes)
      var countAllBookWords = chapters + scenes
      return countAllBookWords
    }
  },
  mounted () {
    var scope = this
    scope.$store.dispatch('loadChaptersByBook', scope.properties.uuid)
    scope.$store.dispatch('loadChapterScenesByBook', scope.properties.uuid)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.export-options { border: 1px solid #eee; border-radius: 4px; padding: 15px; margin-bottom: 10px; }
.export-options label { margin-bottom: 0; }

.export-book-chapter-scene {
  position: fixed;
  top: 210px;
  right: 20px;
  width: 500px;
  z-index:3000;
  padding:10px 15px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 450px;
}
.export-book-chapter-scene .form-group { margin-bottom:10px; }
.export-book-chapter-scene .form-label { font-weight:600; }
.export-book-chapter-scene .form-control { -webkit-box-shadow: none;  box-shadow:none; width:100%; padding:5px; border:1px solid #ccc; }
.export-book-chapter-scene button { height: 40px; background:#293742; padding:5px 10px; width:100%; border:none; color:#fff; }

.export-book-chapter-scene strong { display: block; margin-bottom: 7px; }

.export-book-chapter-scene .chapters-wrap > div {
  padding-left: 0;
  padding-right: 5px;
}
.export-book-chapter-scene .chapters-wrap > div:nth-child(even) {
  padding-right: 0;
  padding-left: 5px;
}
.export-book-chapter-scene .chapter-wrap {
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
}
.export-book-chapter-scene .chapter-wrap label { margin: 0; }
</style>
