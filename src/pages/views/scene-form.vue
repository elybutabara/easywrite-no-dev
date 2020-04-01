<template>
<div class="page-scene-form">
  <div class="page-title">
    <h3>New Scene</h3>
  </div>
  <b-container class="scene-container">
    <b-row class="margin-bottom-1rem">
      <b-col>
        <label>Title: </label>
        <b-form-input v-model="data.title" placeholder="Title"></b-form-input>
      </b-col>
      <b-col>
        <label>Chapter: </label>
        <multiselect v-model="selected_chapter" :options="chapters" placeholder="Select Chapter" label="title" track-by="uuid" deselectLabel="Press enter to deselect"></multiselect>
      </b-col>
    </b-row>
    <b-row class="margin-bottom-1rem">
      <b-col>
        <label>Short Description: </label>
        <b-form-input v-model="data.short_description" placeholder="Short Description"></b-form-input>
      </b-col>
    </b-row>
    <b-tabs class="margin-bottom-1rem" content-class="mt-3" active-nav-item-class="bg-dark text-white">
      <b-tab title="Content" active>
        <tiny-editor :initValue="data.scene_version.content"
                     v-on:getEditorContent="setContent"
                     class="form-control"
        />
      </b-tab>
      <b-tab title="Details">
        <b-row class="margin-bottom-1rem">
          <b-col>
            <label>Type of Scene: </label>
            <multiselect v-model="selected_typeofscene" :options="options_typeofscene" placeholder="Select Type of Scene" label="text" track-by="value" :preselectFirst="true" :allowEmpty="false" :hide-selected="true"></multiselect>
          </b-col>
          <b-col>
            <label>Importance: </label>
            <multiselect v-model="selected_importance" :options="options_importance" placeholder="Select Importance" label="text" track-by="value" :preselectFirst="true" :allowEmpty="false" :hide-selected="true"></multiselect>
          </b-col>
        </b-row>
        <b-row class="margin-bottom-1rem">
          <b-col>
            <label>Tags: </label>
            <b-form-input v-model="data.tags" placeholder="Tags"></b-form-input>
          </b-col>
          <b-col>
            <label>Status: </label>
            <multiselect v-model="selected_status" :options="options_status" placeholder="Select Status" label="text" track-by="value" :preselectFirst="true" :allowEmpty="false" :hide-selected="true"></multiselect>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab title="Notes">
        <tiny-editor :initValue="data.notes"
                     v-on:getEditorContent="setNotes"
                     class="form-control"
        />
      </b-tab>
      <b-tab title="Time/Viewpoint">
        <b-row class="margin-bottom-1rem">
          <b-col cols="6">
            <label>Type: </label>
            <multiselect v-model="selected_weather_type" :options="options_weather_type" placeholder="Select Status" label="text" track-by="value" :preselectFirst="true" :allowEmpty="false" :hide-selected="true"></multiselect>
          </b-col>
        </b-row>
        <b-row class="margin-bottom-1rem">
          <b-col>
            <label>Scene Starts: </label>
            <b-form-datepicker id="date_starts-datepicker" v-model="data.date_starts" class="mb-2" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" placeholder="Select Date Starts"></b-form-datepicker>
          </b-col>
          <b-col>
            <label>Scene Ends: </label>
            <b-form-datepicker id="date_ends-datepicker" v-model="data.date_ends" class="mb-2" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" placeholder="Select Date Ends"></b-form-datepicker>
          </b-col>
        </b-row>
        <b-row class="margin-bottom-1rem">
          <b-col cols="6">
            <label>Point of View: </label>
            <multiselect v-model="selected_character_id_vp" :options="options_character_id_vp" placeholder="Select Point of View" label="text" track-by="value" :preselectFirst="true" :allowEmpty="false" :hide-selected="true"></multiselect>
          </b-col>
        </b-row>
        <b-row class="margin-bottom-1rem">
          <b-col>
            <label>Viewpoint Description: </label>
            <tiny-editor :initValue="data.viewpoint_description"
                         v-on:getEditorContent="setViewpointDescription"
                         class="form-control"
            />
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
    <b-row>
      <b-col class="text-right">
        <b-button @click="saveScene" variant="dark">Save</b-button>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
import TinyMCE from '../../components/TinyMCE'

export default {
  name: 'book-form',
  props: ['properties'],
  data: function () {
    return {
      data: {
        id: null,
        uuid: null,
        book_id: this.properties.uuid,
        chapter_id: '',
        title: '',
        short_description: '',
        scene_version: {
          content: ''
        },
        typeofscene: '',
        importance: '',
        tags: '',
        status: '',
        notes: '',
        weather_type: '',
        date_starts: '',
        date_ends: '',
        character_id_vp: '',
        viewpoint_description: ''
      },
      // List of characters
      chapters: [],
      selected_chapter: null,
      selected_typeofscene: null,
      selected_importance: null,
      selected_status: null,
      selected_weather_type: null,
      selected_character_id_vp: null,
      options_typeofscene: [
        {text: 'Action', value: 'Action'},
        {text: 'Reaction', value: 'Reaction'}
      ],
      options_importance: [
        {text: 'Plot', value: 'Plot'},
        {text: 'Subplot', value: 'Subplot'}
      ],
      options_status: [
        {text: 'Outline', value: 'Outline'},
        {text: 'Draft', value: 'Draft'},
        {text: '1st Edition', value: '1st Edition'},
        {text: '2nd Edition', value: '2nd Edition'},
        {text: 'Done', value: 'Done'}
      ],
      options_weather_type: [
        {text: 'Rainy', value: 'Rainy'},
        {text: 'Sunny', value: 'Sunny'},
        {text: 'Snowy', value: 'Snowy'},
        {text: 'Windy', value: 'Windy'}
      ],
      options_character_id_vp: [
        {text: 'Author', value: '-1'}
      ],
      tempSceneVersionContent: ''
    }
  },
  components: {
    TinyMCE
  },
  methods: {
    // Required for geting value from TinyMCE content
    setContent (value) {
      var scope = this

      // scope.data.scene_version.content = value
      scope.tempSceneVersionContent = value
    },
    setNotes (value) {
      var scope = this

      scope.data.notes = value
    },
    setViewpointDescription (value) {
      var scope = this

      scope.data.viewpoint_description = value
    },
    saveScene () {
      var scope = this

      scope.data.scene_version.content = scope.tempSceneVersionContent
      scope.data.chapter_id = (scope.selected_chapter !== 'undefined' && scope.selected_chapter !== null) ? scope.selected_chapter.uuid : null
      scope.data.typeofscene = scope.selected_typeofscene.value
      scope.data.importance = scope.selected_importance.value
      scope.data.status = scope.selected_status.value
      scope.data.weather_type = scope.selected_weather_type.value
      scope.data.character_id_vp = scope.selected_character_id_vp.value

      scope.axios
        .post('http://localhost:3000/scenes', scope.data)
        .then(response => {
          if (response.data) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Scene successfuly saved',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              // scope.$parent.changeComponent('scene-details', { scene: response.data })
              if (scope.data.uuid === null) {
                console.log('ADDDDDDD')
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.ADD_TO_LIST('scenes', response.data)
              } else {
                console.log('UPPPDATEDD')
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.UPDATE_FROM_LIST('scenes', response.data)
              }
            })
          }
        })
    },
    loadChapter () {
      var scope = this

      var bookId = scope.data.book_id
      scope.axios
        .get('http://localhost:3000/books/' + bookId + '/chapters')
        .then(response => {
          scope.chapters = response.data
        })
    },
    loadScene (sceneId) {
      var scope = this

      scope.axios
        .get('http://localhost:3000/scenes/' + sceneId)
        .then(response => {
          let scene = response.data
          scope.data = scene
          if (scene.scene_version[scene.scene_version.length - 1]) {
            scope.data.scene_version = scene.scene_version[scene.scene_version.length - 1]
          }
        })
    },
    loadSceneChapter (chapterId) {
      var scope = this

      scope.axios
        .get('http://localhost:3000/chapters/' + chapterId)
        .then(response => {
          let chapter = response.data
          scope.selected_chapter = chapter
        })
    }
  },
  beforeMount () {
    var scope = this

    if (scope.properties.scene) {
      scope.$set(scope.data, 'id', scope.properties.scene.id)
      scope.$set(scope.data, 'uuid', scope.properties.scene.uuid)
      scope.$set(scope.data, 'book_id', scope.properties.scene.book_id)

      if (scope.properties.scene.chapter_id) {
        scope.$set(scope.data, 'chapter_id', scope.properties.scene.chapter_id)
        scope.loadSceneChapter(scope.data.chapter_id)
      }
    } else if (scope.properties.chapter) {
      scope.$set(scope.data, 'book_id', scope.properties.chapter.book_id)
      scope.$set(scope.data, 'chapter_id', scope.properties.chapter.uuid)
      scope.selected_chapter = scope.properties.chapter
    } else {
      scope.$set(scope.data, 'book_id', scope.properties.uuid)
    }
  },
  mounted () {
    var scope = this
    if (scope.data.id !== null) {
      window.$('.page-scene-form .page-title h3').html('Update ' + scope.properties.scene.title)
      scope.loadScene(scope.data.uuid)
    }
    scope.loadChapter()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .page-scene-form { padding:20px; }

  .page-title { font-family: 'Crimson Roman Bold'; position:relative; padding-top:20px; }
  .page-title h3 { font-size:35px; }

  .single-picture-file { display: none }
  .uploaded-file-preview { width:100%; cursor: pointer; }
  .uploaded-file-preview img { width:100%; }
  .uploaded-file-preview .default-preview { min-height: 180px; background-color: #293742; color: #fff; text-align: center; }
  .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 180px; opacity: 0.8; }
</style>
