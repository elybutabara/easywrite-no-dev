<template>
<div class="page-scene-form">
    <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <div  v-if="data.id != null">
                    <h4>{{$t('EDIT')}}: <strong>{{ data.title }}</strong></h4>
                    <small>{{$t('DATE_MODIFIED')}}: {{ data.updated_at }}</small>
                </div>
                <div v-else>
                    <h4>{{$t('CREATE_NEW_SCENE')}}</h4>
                </div>
            </div>
            <div class="actions">
                <button v-if="data.id != null" class="es-button-white" @click="saveScene()">{{$t('SAVE_CHANGES')}}</button>
                <button v-else class="es-button-white" @click="saveScene()">{{$t('SAVE')}}</button>
            </div>
        </div>
    </div>
    <div class="es-page-content">
        <div class="container">
        <div class="es-accordion">
            <div class="item" v-bind:class="{'active': accordion['scene-details'] === 'active'}">
                <div class="label" @click="toggleAccordion('scene-details')">
                    {{$t('SCENE_DETAILS').toUpperCase()}}
                    <div class="icon">
                        <i v-if="accordion['scene-details'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['scene-details'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
                    <b-row class="margin-bottom-1rem">
                        <b-col>
                          <label for="input-title">{{$t('TITLE')}}: </label>
                          <b-form-input
                            id="input-title"
                            v-model="data.title"
                            :state="feedback.title.state"
                            aria-describedby="input-live-help input-live-feedback"
                            :placeholder="$t('TITLE')"
                            trim
                          ></b-form-input>

                          <!-- This will only be shown if the preceding input has an invalid state -->
                          <b-form-invalid-feedback id="input-title-feedback">
                            {{ feedback.title.message }}
                          </b-form-invalid-feedback>
                        </b-col>
                        <b-col>
                            <label>{{$tc('CHAPTER',1)}}: </label>
                            <multiselect v-model="selected_chapter" :options="chapters" :placeholder="$t('SELECT') + ' ' + $tc('CHAPTER',1)" label="title" track-by="uuid" :deselectLabel="$t('PLEASE_ENTER_TO_DESELECT')" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
                        </b-col>
                    </b-row>
                    <b-row class="margin-bottom-1rem">
                        <b-col>
                          <label for="input-short-description">{{$t('SHORT_DESCRIPTION')}}: </label>
                          <b-form-input
                            id="input-short-description"
                            v-model="data.short_description"
                            :state="feedback.short_description.state"
                            aria-describedby="input-live-help input-live-feedback"
                            :placeholder="$t('SHORT_DESCRIPTION')"
                            trim
                          ></b-form-input>

                          <!-- This will only be shown if the preceding input has an invalid state -->
                          <b-form-invalid-feedback id="input-short-description-feedback">
                            {{ feedback.short_description.message }}
                          </b-form-invalid-feedback>
                        </b-col>
                    </b-row>
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
                    {{$t('MORE').toUpperCase()}} {{$t('DETAILS').toUpperCase()}}
                    <div class="icon">
                        <i v-if="accordion['more-details'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['more-details'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
                    <b-row class="margin-bottom-1rem">
                    <b-col>
                        <label>{{$t('TYPE_OF_SCENE')}}: </label>
                        <multiselect v-model="selected_typeofscene" :options="options_typeofscene" placeholder="Select Type of Scene" label="text" track-by="value" :preselectFirst="true" :allowEmpty="false" :hide-selected="true" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
                    </b-col>
                    <b-col>
                        <label>{{$t('IMPORTANCE')}}: </label>
                        <multiselect v-model="selected_importance" :options="options_importance" placeholder="Select Importance" label="text" track-by="value" :preselectFirst="true" :allowEmpty="false" :hide-selected="true" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
                    </b-col>
                    </b-row>
                    <b-row class="margin-bottom-1rem">
                    <b-col>
                        <label>{{$t('TAGS')}}: </label>
                        <b-form-input v-model="data.tags" placeholder="Tags"></b-form-input>
                    </b-col>
                    <b-col>
                        <label>{{$t('STATUS')}}: </label>
                        <multiselect v-model="selected_status" :options="options_status" placeholder="Select Status" label="text" track-by="value" :preselectFirst="true" :allowEmpty="false" :hide-selected="true" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
                    </b-col>
                    </b-row>
                </div>
            </div>
            <div class="item" v-bind:class="{'active': accordion['notes'] === 'active'}">
                <div class="label" @click="toggleAccordion('notes')">
                    {{$t('NOTES').toUpperCase()}}
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
                    {{$t('TIME_VIEWPOINT').toUpperCase()}}
                    <div class="icon">
                        <i v-if="accordion['viewpoint'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['viewpoint'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
                    <b-row class="margin-bottom-1rem">
                    <b-col cols="6">
                        <label>{{$t('TYPE')}}: </label>
                        <multiselect v-model="selected_weather_type" :options="options_weather_type" placeholder="Select Status" label="text" track-by="value" :preselectFirst="true" :allowEmpty="false" :hide-selected="true" :selectLabel="$t('PLEASE_ENTER_TO_SELECT')"></multiselect>
                    </b-col>
                    </b-row>
                    <b-row class="margin-bottom-1rem">
                    <b-col>
                        <label>{{$t('SCENE_STARTS')}}: </label>
                        <b-form-datepicker id="date_starts-datepicker" v-model="data.date_starts" class="mb-2" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" :placeholder="$t('SELECT') + ' ' +$t('SCENE_STARTS')"></b-form-datepicker>
                    </b-col>
                    <b-col>
                        <label>{{$t('SCENE_ENDS')}}: </label>
                        <b-form-datepicker id="date_ends-datepicker" v-model="data.date_ends" class="mb-2" :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }" :placeholder="$t('SELECT') + ' ' +$t('SCENE_ENDS')"></b-form-datepicker>
                    </b-col>
                    </b-row>
                    <b-row class="margin-bottom-1rem">
                    <b-col cols="6">
                        <label>{{$t('POINT_OF_VIEW')}}: </label>
                        <multiselect v-model="selected_character_id_vp" :options="options_character_id_vp" :placeholder="$t('SELECT') + ' ' +$t('POINT_OF_VIEW')" label="text" track-by="value" :preselectFirst="true" :allowEmpty="false" :hide-selected="true"></multiselect>
                    </b-col>
                    </b-row>
                    <b-row class="margin-bottom-1rem">
                    <b-col>
                        <label>{{$t('VIEWPOINT')}} {{$t('DESCRIPTION')}}: </label>
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
                    {{$tc('ITEM',2).toUpperCase()}}
                    <div class="icon">
                        <i v-if="accordion['items'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['items'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
                    <p><strong>{{$t('CLICK')}}</strong> {{$tc('ITEM', 1).toLowerCase()}} {{$t('ADD_IT_INTO_SCENE')}}</p>
                    <div @click="toggleChild('items',item)" v-bind:class="{'selected' : selected_items.includes(item.uuid) }" class="es-toggle-select" v-bind:key="item.id" v-for="item in GET_ITEMS_BY_BOOK(properties.book_id)">
                        <i v-if="selected_items.includes(item.uuid)" class="fas fa-check"></i> &nbsp;{{ item.itemname }}
                    </div>
                </div>
            </div>
            <div class="item" v-bind:class="{'active': accordion['characters'] === 'active'}">
                <div class="label" @click="toggleAccordion('characters')">
                    {{$tc('CHARACTER',2).toUpperCase()}}
                    <div class="icon">
                        <i v-if="accordion['characters'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['characters'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
                    <p><strong>{{$t('CLICK')}}</strong> {{$tc('CHARACTER', 1).toLowerCase()}} {{$t('ADD_IT_INTO_SCENE')}}</p>
                    <div @click="toggleChild('characters',character)" v-bind:class="{'selected' : selected_characters.includes(character.uuid) }" class="es-toggle-select" v-bind:key="character.id" v-for="character in GET_CHARACTERS_BY_BOOK(properties.book_id)">
                        <i v-if="selected_characters.includes(character.uuid)" class="fas fa-check"></i> &nbsp;{{ character.fullname }}
                    </div>
                </div>
            </div>
            <div class="item" v-bind:class="{'active': accordion['locations'] === 'active'}">
                <div class="label" @click="toggleAccordion('locations')">
                    {{$tc('LOCATION',2).toUpperCase()}}
                    <div class="icon">
                        <i v-if="accordion['locations'] === 'active'" class="fas fa-chevron-down"></i>
                        <i v-if="accordion['locations'] !== 'active'" class="fas fa-chevron-right"></i>
                    </div>
                </div>
                <div class="content ">
                    <p><strong>{{$t('CLICK')}}</strong> {{$tc('LOCATION', 1).toLowerCase()}} {{$t('ADD_IT_INTO_SCENE')}}</p>
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
      selected_character_id_vp: '-1',
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
      },
      feedback: {
        title: {
          state: null,
          message: null
        },
        short_description: {
          state: null,
          message: null
        }
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

      var items = scope.$store.getters.getSceneItems(scope.properties.scene.uuid)
      for (let i = 0; i < items.length; i++) {
        var item = items[i].item
        scope.selected_items.push(item.uuid)
      }

      var locations = scope.$store.getters.getSceneLocations(scope.properties.scene.uuid)
      for (let i = 0; i < locations.length; i++) {
        let location = locations[i].location
        scope.selected_locations.push(location.uuid)
      }

      var characters = scope.$store.getters.getSceneCharacters(scope.properties.scene.uuid)
      for (let i = 0; i < characters.length; i++) {
        let character = characters[i].character
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
    setAll (obj, val) {
      Object.keys(obj).forEach(function (index) {
        obj[index] = val
      })
    },
    setFeedbackNull () {
      var scope = this
      scope.setAll(scope.feedback.title, null)
      scope.setAll(scope.feedback.short_description, null)
    },
    saveScene () {
      var scope = this
      var hasError = false

      scope.data.scene_version.content = scope.tempSceneVersionContent
      scope.data.notes = scope.tempSceneNotes
      scope.data.viewpoint_description = scope.tempViewpointDescription
      scope.data.chapter_id = (scope.selected_chapter !== 'undefined' && scope.selected_chapter !== null) ? scope.selected_chapter.uuid : null
      scope.data.typeofscene = scope.selected_typeofscene.value
      scope.data.importance = scope.selected_importance.value
      scope.data.status = scope.selected_status.value
      scope.data.weather_type = scope.selected_weather_type.value
      // scope.data.character_id_vp = scope.selected_character_id_vp.value
      // scope.data.character_id_vp = scope.selected_character_id_vp.value

      // Clear all error in form
      scope.setFeedbackNull()

      if (!scope.data.title) {
        scope.feedback.title.message = 'Title is required'
        scope.feedback.title.state = false
        hasError = true
      }

      if (scope.data.short_description.length > 30) {
        scope.feedback.short_description.message = 'Max char 30'
        scope.feedback.short_description.state = false
        hasError = true
      }

      if (hasError) {
        return false
      }

      scope.axios
        .post('http://localhost:3000/scenes', scope.data)
        .then(response => {
          if (response.data) {
            window.swal.fire({
              position: 'center',
              icon: 'success',
              title: this.$t('SUCCESSFULY_SAVED'),
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              // scope.$parent.changeComponent('scene-details', { scene: response.data })
              if (scope.data.uuid === null) {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.saveChild(response.data.uuid)
                scope.$store.dispatch('updateSceneList', response.data)
                // refresh vuex to update all related records
                scope.$store.dispatch('loadVersionsByScene', response.data)
                scope.CHANGE_COMPONENT({tabKey: 'scene-details-' + response.data.uuid, tabComponent: 'scene-details', tabData: { book_id: response.data.book_id, scene: response.data }, tabTitle: 'View - ' + response.data.title, tabIndex: scope.$store.getters.getActiveTab})
              } else {
                scope.$set(scope.data, 'id', response.data.id)
                scope.$set(scope.data, 'uuid', response.data.uuid)
                scope.$set(scope.data, 'updated_at', response.data.updated_at)
                scope.saveChild(response.data.uuid)
                // refresh vuex to update all related records
                scope.$store.dispatch('updateSceneList', response.data)
                scope.$store.dispatch('loadVersionsByScene', response.data)
                scope.$store.dispatch('changeTabTitle', {key: 'scene-form-' + response.data.uuid, title: 'Edit -' + response.data.title})
                scope.$store.dispatch('changeTabTitle', {key: 'scene-details-' + response.data.uuid, title: 'Edit -' + response.data.title})
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
            setTimeout(function () {
              scope.selected_character_id_vp = scope.data.character_id_vp
            }, 1000)
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
      // load book
      scope.$store.dispatch('loadCharactersByBook', scope.properties.book_id)
      scope.$store.dispatch('loadItemsByBook', scope.properties.book_id)
      scope.$store.dispatch('loadLocationsByBook', scope.properties.book_id)

      // load scene children
      scope.$store.dispatch('loadCharactersByScene', scope.properties.scene)
      scope.$store.dispatch('loadItemsByScene', scope.properties.scene)
      scope.$store.dispatch('loadLocationsByScene', scope.properties.scene)
      scope.$store.dispatch('loadVersionsByScene', scope.properties.scene)

      setTimeout(function () {
        scope.setSelectedChild()
      }, 500)
    }

    scope.loadChapter()
    setTimeout(function () {
      scope.page.is_ready = true
      var bookCharacters = scope.$store.getters.getCharactersByBook(scope.properties.book_id)
      for (let i = 0; i < bookCharacters.length; i++) {
        let character = bookCharacters[i]
        scope.options_character_id_vp.push({ text: character.fullname, value: character.uuid })
      }
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
