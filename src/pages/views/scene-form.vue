<template>
<div class="page-scene-form">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <div  v-if="data.id != null">
                    <h4>Edit: <strong>{{ data.title }}</strong></h4>
                    <small>Date Modified: {{ data.updated_at }}</small>
                </div>
                <div v-else>
                    <h4>Create New Scene</h4>
                </div>
            </div>
            <div class="actions">
                <button v-if="data.id != null" class="es-button-white" @click="saveScene()">Save Changes</button>
                <button v-else class="es-button-white" @click="saveScene()">Save</button>
            </div>
        </div>
    </div>
    <div class="es-page-content">
        <div class="container">
        <div class="es-accordion">
            <div class="item" v-bind:class="{'active': accordion['scene-details'] === 'active'}">
                <div class="label" @click="toggleAccordion('scene-details')">
                    SCENE DETAILS
                    <div class="icon">
                        <i v-if="accordion['scene-details'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['scene-details'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
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
                </div>
            </div>
            <div class="item" v-bind:class="{'active': accordion['content'] === 'active'}">
                <div class="label" @click="toggleAccordion('content')">
                    CONTENT
                    <div class="icon">
                        <i v-if="accordion['scene-details'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['scene-details'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
                    <b-row class="margin-bottom-1rem">
                        <b-col>
                            <tiny-editor :initValue="data.scene_version.content"
                                        v-on:getEditorContent="setContent"
                                        class="form-control"
                            />
                        </b-col>
                    </b-row>
                </div>
            </div>
            <div class="item" v-bind:class="{'active': accordion['more-details'] === 'active'}">
                <div class="label" @click="toggleAccordion('more-details')">
                    MORE DETAILS
                    <div class="icon">
                        <i v-if="accordion['more-details'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['more-details'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
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
                </div>
            </div>
            <div class="item" v-bind:class="{'active': accordion['notes'] === 'active'}">
                <div class="label" @click="toggleAccordion('notes')">
                    NOTES
                    <div class="icon">
                        <i v-if="accordion['notes'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['notes'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
                    <tiny-editor :initValue="data.notes"
                                v-on:getEditorContent="setNotes"
                                class="form-control"
                    />
                </div>
            </div>
            <div class="item" v-bind:class="{'active': accordion['viewpoint'] === 'active'}">
                <div class="label" @click="toggleAccordion('viewpoint')">
                    TIME/VIEWPOINT
                    <div class="icon">
                        <i v-if="accordion['viewpoint'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['viewpoint'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
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
                </div>
            </div>
            <div class="item" v-bind:class="{'active': accordion['items'] === 'active'}">
                <div class="label" @click="toggleAccordion('items')">
                    ITEMS
                    <div class="icon">
                        <i v-if="accordion['items'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['items'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
                    <p>Click to add items to the scene</p>
                    <div @click="toggleChild('items',item)" v-bind:class="{'selected' : selected_items.includes(item.uuid) }" class="es-toggle-select" v-bind:key="item.id" v-for="item in GET_ITEMS_BY_BOOK(properties.book_id)">
                        <i v-if="selected_items.includes(item.uuid)" class="fas fa-check"></i> &nbsp;{{ item.itemname }}
                    </div>
                </div>
            </div>
            <div class="item" v-bind:class="{'active': accordion['characters'] === 'active'}">
                <div class="label" @click="toggleAccordion('characters')">
                    CHARACTERS
                    <div class="icon">
                        <i v-if="accordion['characters'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['characters'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
                    <p>Click to add characters to the scene</p>
                    <div @click="toggleChild('characters',character)" v-bind:class="{'selected' : selected_characters.includes(character.uuid) }" class="es-toggle-select" v-bind:key="character.id" v-for="character in GET_CHARACTERS_BY_BOOK(properties.book_id)">
                        <i v-if="selected_characters.includes(character.uuid)" class="fas fa-check"></i> &nbsp;{{ character.fullname }}
                    </div>
                </div>
            </div>
            <div class="item" v-bind:class="{'active': accordion['locations'] === 'active'}">
                <div class="label" @click="toggleAccordion('locations')">
                    LOCATIONS
                    <div class="icon">
                        <i v-if="accordion['locations'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['locations'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
                    <p>Click to add locations to the scene</p>
                    <div @click="toggleChild('locations',location)" v-bind:class="{'selected' : selected_locations.includes(location.uuid) }" class="es-toggle-select" v-bind:key="location.id" v-for="location in GET_LOCATIONS_BY_BOOK(properties.book_id)">
                        <i v-if="selected_locations.includes(location.uuid)" class="fas fa-check"></i> &nbsp;{{ location.location }}
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
        title: '',
        is_ready: false
      },
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
      tempSceneVersionContent: '',
      tempSceneNotes: '',
      tempViewpointDescription: '',
      accordion: {
        'scene-details': 'active',
        'content': 'inactive',
        'more-details': 'inactive',
        'notes': 'inactive',
        'viewpoint': 'inactive',
        'characters': 'inactive',
        'locations': 'inactive',
        'items': 'inactive'
      },
      selected_items: [],
      selected_characters: [],
      selected_locations: [],
      baseContentCount: '',
      authorProgress: {
        author_id: '',
        relation_id: '',
        is_for: 'scene',
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
    setSelectedChild: function () {
      var scope = this

      var items = scope.GET_SCENE_ITEMS_BY_SCENE(scope.properties.scene.uuid)
      for (let i = 0; i < items.length; i++) {
        var item = items[i].item
        scope.selected_items.push(item.uuid)
      }

      var locations = scope.GET_SCENE_LOCATIONS_BY_SCENE(scope.properties.scene.uuid)
      for (let i = 0; i < locations.length; i++) {
        var location = locations[i].location
        scope.selected_locations.push(location.uuid)
      }

      var characters = scope.GET_SCENE_CHARACTERS_BY_SCENE(scope.properties.scene.uuid)
      for (let i = 0; i < characters.length; i++) {
        var character = characters[i].character
        scope.selected_characters.push(character.uuid)
      }
    },
    toggleChild: function (model, data) {
      var scope = this
      if (model === 'items' && scope.selected_items.includes(data.uuid)) {
        for (let i = 0; i < scope.selected_items.length; i++) {
          if (scope.selected_items[i] === data.uuid) {
            scope.selected_items.splice(i, 1)
            return
          }
        }
      } else if (model === 'items' && !scope.selected_items.includes(data.uuid)) {
        scope.selected_items.push(data.uuid)
        return
      }

      if (model === 'characters' && scope.selected_characters.includes(data.uuid)) {
        for (let i = 0; i < scope.selected_characters.length; i++) {
          if (scope.selected_characters[i] === data.uuid) {
            scope.selected_characters.splice(i, 1)
            return
          }
        }
      } else if (model === 'characters' && !scope.selected_characters.includes(data.uuid)) {
        scope.selected_characters.push(data.uuid)
        return
      }

      if (model === 'locations' && scope.selected_locations.includes(data.uuid)) {
        for (let i = 0; i < scope.selected_locations.length; i++) {
          if (scope.selected_locations[i] === data.uuid) {
            scope.selected_locations.splice(i, 1)
            return
          }
        }
      } else if (model === 'locations' && !scope.selected_locations.includes(data.uuid)) {
        scope.selected_locations.push(data.uuid)
      }
    },
    saveChild: function (bookSceneID) {
      var scope = this
      scope.axios
        .post('http://localhost:3000/scene-items/batch', { book_scene_id: bookSceneID, rows: scope.selected_items })
        .then(response => {
          console.log('scene items added')
        })

      scope.axios
        .post('http://localhost:3000/scene-locations/batch', { book_scene_id: bookSceneID, rows: scope.selected_locations })
        .then(response => {
          console.log('scene locations added')
        })

      scope.axios
        .post('http://localhost:3000/scene-characters/batch', { book_scene_id: bookSceneID, rows: scope.selected_characters })
        .then(response => {
          console.log('scene characters added')
        })

      if (scope.authorProgress.uuid) {
        scope.authorProgress.total_words = scope.authorProgress.total_words + (scope.WORD_COUNT(scope.tempSceneVersionContent) - scope.baseContentCount)
      } else {
        scope.authorProgress.author_id = scope.$store.getters.getAuthorID
        scope.authorProgress.relation_id = bookSceneID
        scope.authorProgress.total_words = scope.WORD_COUNT(scope.tempSceneVersionContent) - scope.baseContentCount
      }

      scope.axios
        .post('http://localhost:3000/author-personal-progress', scope.authorProgress)
        .then(response => {
          scope.authorProgress = response
          scope.$store.dispatch('loadAuthorPersonalProgress', { authorId: this.$store.getters.getAuthorID })
        })

      let sceneHistory = {
        scene_id: bookSceneID,
        content: scope.data.scene_version.content
      }

      scope.axios
        .post('http://localhost:3000/book-scene-history', sceneHistory)
        .then(response => {
          console.log('Scene history saved!')
        })
    },
    // Required for geting value from TinyMCE content
    setContent (value) {
      var scope = this

      // scope.data.scene_version.content = value
      scope.tempSceneVersionContent = value
    },
    setNotes (value) {
      var scope = this

      scope.tempSceneNotes = value
    },
    setViewpointDescription (value) {
      var scope = this
      scope.tempViewpointDescription = value
    },
    saveScene () {
      var scope = this

      scope.data.scene_version.content = scope.tempSceneVersionContent
      scope.data.notes = scope.tempSceneNotes
      scope.data.viewpoint_description = scope.tempViewpointDescription
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
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.saveChild(response.data.uuid)
                scope.ADD_TO_LIST('scenes', response.data)
                // refresh vuex to update all related records
                scope.LOAD_LIST('scene-versions', scope.data)
              } else {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.saveChild(response.data.uuid)
                scope.UPDATE_FROM_LIST('scenes', response.data)
                // refresh vuex to update all related records
                scope.LOAD_LIST('scene-versions', scope.data)
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

            scope.tempSceneVersionContent = scope.data.scene_version.content
            scope.tempSceneNotes = scope.data.notes
            scope.tempViewpointDescription = scope.data.viewpoint_description

            scope.baseContentCount = scope.WORD_COUNT(scope.tempSceneVersionContent)
          }
        })

      scope.axios
        .get('http://localhost:3000/authors/' + scope.$store.getters.getAuthorID + '/scene/' + sceneId + '/personal-progress/today')
        .then(response => {
          if (response.data) {
            scope.authorProgress = response.data
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
      scope.LOAD_LIST('scene-locations', scope.properties.scene)
      scope.LOAD_LIST('scene-items', scope.properties.scene)
      scope.LOAD_LIST('scene-characters', scope.properties.scene)

      setTimeout(function () {
        scope.setSelectedChild()
      }, 500)
    }

    scope.LOAD_LIST('locations', { uuid: scope.properties.book_id })
    scope.LOAD_LIST('items', { uuid: scope.properties.book_id })
    scope.LOAD_LIST('characters', { uuid: scope.properties.book_id })

    scope.loadChapter()

    setTimeout(function () {
      scope.page.is_ready = true
    }, 500)
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

    .es-toggle-select { display:inline-block; background:#e0e7ed; border:1px solid #ccc; padding:4px 20px; border-radius:8px; margin:5px 5px; cursor:pointer; font-size:14px; }
    .es-toggle-select.selected { background:#293742; color:#fff; }

    .es-accordion .item { background:#fafafa; border-bottom:2px solid #e0e5ee; padding:10px 15px; }
    .es-accordion .item .label { position:relative; cursor:pointer; }
    .es-accordion .item .label .icon { position:absolute; top:0px; right:0px; }
    .es-accordion .item .content { display:none; margin-top:20px; margin-bottom:20px; }
    .es-accordion .item.active .content { display:block; }
</style>
